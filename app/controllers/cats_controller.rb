class CatsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    get_all_breeds
    get_all_locations
    @search = params[:search]
    
    if @search.present?
      @filter = params[:search][:breed_id].flatten.reject(&:blank?)
      @kittens = Cat.is_parent(false).where(breed_id: @filter)
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
      get_parent_breeds(user)
      get_parents(user)
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

      if @cat.save
        flash[:notice] = 'Parent was successfully created'
        redirect_to cattery_overview_path
      else
        flash[:alert] = 'There was a problem with creating this parent'
        render 'new'
      end

    elsif @form == 'kitten'
      get_parent_breeds(user)
      get_parents(user)
      get_litters(user)

      @cat = Cat.new(kitten_params)
      @cat.user_id = user.id
      @cat.is_parent = false

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
      user = @cat.user
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

  def parent_params
    params.require(:cat).permit(:name, :gender, :color, :origin, :card_picture, :is_parent, :breed_id, :user_id)
  end

  def kitten_params
    params.require(:cat).permit(:name, :gender, :color, :is_available, :is_vaccinated, :is_castrated, :card_picture, :breed_id, :user_id, :pair_id, :litter_number, :birth_date, pictures: [])
  end

  def get_all_breeds
    breeds = Cat.distinct.pluck(:breed_id)
    @all_breeds_array = breeds.map { |breed| ["#{Breed.find_by(id: breed).name}", breed] }.sort_by{|breed| breed[0]}
  end

  def get_all_locations
    locations = User.distinct.where.not(city: nil).where.not(country: nil).pluck(:city, :country)
    @all_locations_array = locations.reverse!.sort_by{|location| [location[1], location[0]]}
    @all_locations_array = locations.map { |location| ["#{location[0]} - #{location[1]}", location[0]] }
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
