class CatsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    get_all_available_breeds
    get_all_available_locations
    
    if params[:breeds].present? or params[:locations].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      @location_filter = params[:locations].flatten.reject(&:blank?)
      # @kittens = Cat.is_parent(false).kitten_search(@filter).order(created_at: :desc) 
      if @breed_filter.empty? && @location_filter.empty?
        @kittens = Cat.is_parent(false).order(created_at: :desc)
      elsif @location_filter.empty?
        @kittens = Cat.is_parent(false).tagged_with(@breed_filter, :on => :breed_tag, :any => true).order(created_at: :desc)
      elsif @breed_filter.empty?
        @kittens = Cat.is_parent(false).tagged_with(@location_filter, :on => :location_tag, :any => true).order(created_at: :desc)
      end
    else
      @kittens = Cat.is_parent(false).order(created_at: :desc)
    end
  end

  def new
    @form = params[:form]
    @cat = Cat.new
    user = current_user

    if @form == 'parent'
      get_breeds
    elsif @form == 'kitten'
      get_parents(user)
      get_parent_breeds(user)
      get_litters(user)
    end
  end

  def create
    @form = params[:form]
    user = current_user
    
    if @form == 'parent'
      get_breeds
      @cat = Cat.new(parent_params)
      @cat.user_id = user.id
      @cat.is_parent = true
      @cat.breed_tag_list = "#{Breed.find(params[:cat][:breed_id]).name}"
      @cat.location_tag_list = "#{Country.find(user.country_id).name}-#{user.city.capitalize}"
      
      if @cat.save
        flash[:notice] = 'Parent was successfully created'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with creating this parent'
        render 'new'
      end

    elsif @form == 'kitten'
      get_parents(user)
      get_parent_breeds(user)
      get_litters(user)

      @cat = Cat.new(kitten_params)
      @cat.user_id = user.id
      @cat.is_parent = false
      @cat.breed_tag_list = "#{Breed.find(params[:cat][:breed_id]).name}"
      @cat.location_tag_list = "#{Country.find(user.country_id).name}-#{user.city.capitalize}"

      if @cat.save
        flash[:notice] = 'Kitten was successfully created'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with creating this kitten'
        render 'new'
      end

    else
      flash[:alert] = 'There was a problem with creating this cat'
      render 'new'
    end
  end

  def show
  end

  def edit
    @cat = Cat.find_by(id: params[:id])
    @form = params[:form]
    user = @cat.user

    if @form == 'parent'
      get_breeds
    elsif @form == 'kitten'
      get_parent_breeds(user)
      get_parents(user)
      get_litters(user)
      @cat.birth_date = @cat.birth_date.to_date.to_formatted_s(:rfc822)
    end
  end

  def update
    @cat = Cat.find_by(id: params[:id])
    @form = params[:form]
    user = @cat.user

    @cat.breed_tag_list = "#{Breed.find(params[:cat][:breed_id]).name}"
    @cat.location_tag_list = "#{Country.find(user.country_id).name}-#{user.city.capitalize}"

    if @form == 'parent'
      get_breeds

      if @cat.update(parent_params)
        flash[:notice] = 'Parent was successfully updated'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with updating this Parent'
        render 'edit'
      end

    elsif @form == 'kitten'
      get_parent_breeds(user)
      get_parents(user)
      get_litters(user)

      if @cat.update(kitten_params)
        flash[:notice] = 'Kitten was successfully updated'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with updating this kitten'
        render 'edit'
      end

    else
      flash[:alert] = 'There was a problem with updating this cat'
      render 'edit'
    end
  end

  def destroy
    @form = params[:form]
    @cat = Cat.find_by(id: params[:id])

    if @form == 'parent'
      if @cat.destroy
        flash[:notice] = 'Parent was successfully deleted'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with deleting this parent'
        render 'edit'
      end

    elsif @form == 'kitten'
      if @cat.destroy
        flash[:notice] = 'Kitten was successfully deleted'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with deleting this kitten'
        render 'edit'
      end
    else
      flash[:alert] = 'There was a problem with deleting this cat'
      render 'edit'
    end
  end
  
  private
  
  def kittens_params
    params.require(:cat).permit(:breeds, :locations)
  end

  def parent_params
    params.require(:cat).permit(:name, :gender, :color, :origin, :card_picture, :is_parent, :breed_id, :user_id, :breed_tag_list, :location_tag_list)
  end

  def kitten_params
    params.require(:cat).permit(:name, :gender, :color, :is_available, :is_vaccinated, :is_castrated, :card_picture, :breed_id, :user_id, :pair_id, :litter_number, :birth_date, :breed_tag_list, :location_tag_list, pictures: [])
  end

  def get_all_available_breeds
    if params[:locations].present?
      @location_filter = params[:locations].flatten.reject(&:blank?)

      breeds = Cat.is_parent(false).distinct.pluck(:breed_id)
    else
      breeds = Cat.is_parent(false).distinct.pluck(:breed_id)
    end
    @all_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
  end

  def get_all_available_locations
    if params[:breeds].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      cat_ids = Cat.is_parent(false).tagged_with(@breed_filter, :on => :breed_tag, :any => true).pluck(:id)      
      locations = User.joins(:cats).where(cats: { id: cat_ids }).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    else
      locations = User.where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    end
    @all_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{Country.find(location[1]).name}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort
  end

  def get_breeds
    breeds = Breed.order(:name)
    @breeds_array = breeds.map { |breed| [breed.name, breed.id] }
  end

  def get_parent_breeds(user)
    breeds = Cat.user_id(user.id).distinct.pluck(:breed_id)
    @breeds_array = breeds.map { |breed| [Breed.find_by(id: breed).name, Breed.find_by(id: breed).id] }.sort
  end

  def get_parents(user)
    pairs = Pair.user_id(user.id)
    @parents_array = pairs.map { |pair| ["#{pair.male.name} & #{pair.female.name}", pair.id] }
  end

  def get_litters(user)
    litter_number_information = Cat.user_id(user.id).where.not(litter_number: nil).distinct.pluck(:litter_number, :pair_id, :birth_date)
    @litter_numbers = litter_number_information.reverse.map { |l| ["#{l[0]} - #{l[2].to_date.to_formatted_s(:rfc822)} - #{Pair.find_by(id: l[1]).male.name} & #{Pair.find_by(id: l[1]).female.name}", l[0]] }
  end
end
