class CatsController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!, only: [:index, :show, :update_filters]

  def index
    get_all_available_breeds
    get_all_available_locations
    user_ids = User.is_cattery(true).pluck(:id)
    cats = Cat.where(user_id: user_ids).is_parent(false)

    if params[:breeds].present? or params[:locations].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      @location_filter = params[:locations].flatten.reject(&:blank?)

      if @breed_filter.empty? && @location_filter.empty?
        @pagy, @kittens = pagy_countless(cats.order(created_at: :desc))
      elsif @location_filter.empty?
        @pagy, @kittens = pagy_countless(cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).order(created_at: :desc))
      elsif @breed_filter.empty?
        @pagy, @kittens = pagy_countless(cats.tagged_with(@location_filter, :on => :location_tag, :any => true).order(created_at: :desc))
      else
        @pagy, @kittens = pagy_countless(cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).tagged_with(@location_filter, :on => :location_tag, :any => true).order(created_at: :desc))
      end
    else
      @pagy, @kittens = pagy_countless(cats.order(created_at: :desc))
    end
  end

  def new
    @form = params[:form]
    @cat = Cat.new
    user = current_user

    if @form == 'parent'
      all_breeds
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
      all_breeds
      @cat = Cat.new(parent_params)
      @cat.user_id = user.id
      @cat.is_parent = true
      @cat.breed_tag_list = "#{Breed.find(params[:cat][:breed_id]).name}"
      @cat.location_tag_list = "#{Country.find(user.country_id).name}-#{user.city.capitalize}"

      if @cat.save
        flash[:notice] = 'Parent was successfully created'
        redirect_to overview_cattery_path(user)
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
        redirect_to overview_cattery_path(user)
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
    @cat = Cat.friendly.find(params[:id])
    @user = User.find(@cat.user_id)
    @message = Message.new(params[:message])
  end

  def edit
    @cat = Cat.friendly.find(params[:id])
    @form = params[:form]
    user = @cat.user

    if @form == 'parent'
      all_breeds
    elsif @form == 'kitten'
      get_parent_breeds(user)
      get_parents(user)
      get_litters(user)
      @cat.birth_date = @cat.birth_date.to_date.to_formatted_s(:rfc822)
    end
  end

  def update
    @cat = Cat.friendly.find(params[:id])
    @form = params[:form]
    user = @cat.user

    @cat.breed_tag_list = "#{Breed.find(params[:cat][:breed_id]).name}"
    @cat.location_tag_list = "#{Country.find(user.country_id).name}-#{user.city.capitalize}"

    if @form == 'parent'
      all_breeds

      if @cat.update(parent_params)
        flash[:notice] = 'Parent was successfully updated'
        redirect_to overview_cattery_path(user)
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
        redirect_to overview_cattery_path(user)
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
    @cat = Cat.friendly.find(params[:id])
    user = @cat.user

    if @form == 'parent'
      if @cat.destroy
        flash[:notice] = 'Parent was successfully deleted'
        redirect_to overview_cattery_path(user)
      else
        flash[:alert] = 'There was a problem with deleting this parent'
        render 'edit'
      end

    elsif @form == 'kitten'
      if @cat.destroy
        flash[:notice] = 'Kitten was successfully deleted'
        redirect_to overview_cattery_path(user)
      else
        flash[:alert] = 'There was a problem with deleting this kitten'
        render 'edit'
      end
    else
      flash[:alert] = 'There was a problem with deleting this cat'
      render 'edit'
    end
  end

  def update_filters
    @breed_filter = params[:breeds]
    @location_filter = params[:locations]

    if params[:breeds].present?
      breed_ids = Cat.is_parent(false).tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)   
      locations = User.is_cattery(true).joins(:cats).where(cats: { is_parent: false, breed_id: breed_ids }).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    else
      locations = User.is_cattery(true).joins(:cats).where(cats: { is_parent: false }).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    end

    if params[:locations].present?
      breeds = Cat.is_parent(false).tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:breed_id)
    else
      breeds = Cat.is_parent(false).distinct.pluck(:breed_id)
    end

    @all_available_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{Country.find(location[1]).name}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort

    render json: { breeds: @all_available_breeds_array, locations: @all_available_locations_array }
  end

  private

  def set_user
    @user = current_user
  end

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
    breeds = Cat.is_parent(false).distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
  end

  def get_all_available_locations
    locations = User.is_cattery(true).joins(:cats).where(cats: { is_parent: false }).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{Country.find(location[1]).name}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort
  end

  def all_breeds
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
