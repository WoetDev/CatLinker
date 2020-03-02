class UsersController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!, only: [:index, :show, :update_filters]

  def index
    all_available_breeds
    all_available_locations
    
    if params[:breeds].present? or params[:locations].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      @location_filter = params[:locations].flatten.reject(&:blank?)

      if @breed_filter.empty? && @location_filter.empty?
        @pagy, @catteries = pagy_countless(User.is_cattery(true).joins(:cats).distinct(:id).order(cats_count: :desc))
      elsif @location_filter.empty?
        breed_ids = Cat.tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)
        @pagy, @catteries = pagy_countless(User.is_cattery(true).joins(:cats).distinct(:id).where(cats: { breed_id: breed_ids }).order(cats_count: :desc))
      elsif @breed_filter.empty?
        cat_ids = Cat.tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:id)
        @pagy, @catteries = pagy_countless(User.is_cattery(true).joins(:cats).distinct(:id).where(cats: { id: cat_ids }).order(cats_count: :desc))
      else
        cat_ids = Cat.tagged_with(@breed_filter, :on => :breed_tag, :any => true).tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:id)
        @pagy, @catteries = pagy_countless(User.is_cattery(true).joins(:cats).distinct(:id).where(cats: { id: cat_ids }).order(cats_count: :desc))
      end
    else
      @pagy, @catteries = pagy_countless(User.is_cattery(true).joins(:cats).distinct(:id).order(cats_count: :desc))
    end
  end

  def show
    @user = User.friendly.find(params[:id])
    @message = Message.new(params[:message])
  end

  def my_cattery
    @user = User.friendly.find(params[:id])

    get_all_countries
    check_required_cattery_information(@user)
  end

  def update_cattery
    @user = User.friendly.find(params[:id])
    get_all_countries

    if @user.update(cattery_params)
      update_cat_location_tags(@user)
      check_required_cattery_information(@user)
      flash[:notice] = 'Cattery information was successfully updated'
      render 'my_cattery'
    else
      check_required_cattery_information(@user)
      flash[:alert] = 'There was a problem updating your cattery information'
      render 'my_cattery'
    end
  end

  def cattery_overview
    @user = User.friendly.find(params[:id])
    @parents = Cat.user_id(@user.id).is_parent(true)
    @pairs = Pair.user_id(@user.id)
    @kittens = Cat.user_id(@user.id).is_parent(false)

    @male_parents = Cat.user_id(@user.id).is_parent(true).gender('1')
    @female_parents = Cat.user_id(@user.id).is_parent(true).gender('2')
  end

  def birth_date
    user = current_user

    @birth_date = Cat.user_id(user.id).find_by(litter_number: params[:litter_number]).birth_date

    render json: @birth_date
  end

  def new_litter
    litter_number = Cat.user_id(current_user.id).maximum('litter_number')

    if litter_number.present?
      @new_litter_number = Cat.user_id(current_user.id).maximum('litter_number')+1
    else
      @new_litter_number = 1
    end

    render json: @new_litter_number
  end

  def update_filters
    @breed_filter = params[:breeds]
    @location_filter = params[:locations]

    if params[:breeds].present?
      breed_ids = Cat.tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)
      locations = User.is_cattery(true).joins(:cats).where(cats: { breed_id: breed_ids }).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    else
      locations = User.is_cattery(true).joins(:cats).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    end

    if params[:locations].present?
      breed_ids = Cat.tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:breed_id)
      breeds = User.is_cattery(true).joins(:cats).where(cats: { breed_id: breed_ids }).distinct.pluck(:breed_id)
    else
      breeds = User.is_cattery(true).joins(:cats).distinct.pluck(:breed_id)
    end

    @all_available_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{Country.find(location[1]).name}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort

    render json: { breeds: @all_available_breeds_array, locations: @all_available_locations_array }
  end

  private

  def set_user
    @user = current_user
  end

  def all_available_breeds
    breeds = User.is_cattery(true).joins(:cats).distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
  end

  def all_available_locations
    locations = User.is_cattery(true).joins(:cats).where.not(city: nil).where.not(country_id: nil).distinct.pluck(:city, :country_id)
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{Country.find(location[1]).name}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort
  end

  def cattery_params
    params.require(:user).permit(:cattery_name, :certification_number, :street,
    :number, :postal_code, :city, :country_id, :phone_number, :facebook_link,
    :instagram_link, :twitter_link, :profile_picture)
  end

  def get_all_countries
    countries = Country.all.sort
    @all_countries = countries.map { |c| [c.name, c.id] }.sort_by{|c| c[0]}
  end

  def check_required_cattery_information(user)
    if user.profile_picture.blank? or user.cattery_name.blank? or user.postal_code.blank? or user.city.blank? or user.country_id.blank?
      required_info = [user.profile_picture, user.cattery_name, user.postal_code, user.city, user.country_id]
      required_info_strings = ["profile picture", "cattery name", "postal code", "city", "country"]
      blank_required_info_array = []

      required_info.each.with_index do |info, index|
        if info.blank?
          blank_required_info_array.push(required_info_strings[index])
        end
      end

      if blank_required_info_array.size > 1
        blank_required_info_string = blank_required_info_array.take(blank_required_info_array.size-1).join(', ')
        blank_required_info_string = "#{blank_required_info_string} and #{blank_required_info_array.last}"
      else
        blank_required_info_string = blank_required_info_array.join
      end

      @required_info_message = "You must add a #{blank_required_info_string} before you can add cats"
    end
  end

  def update_cat_location_tags(user)
    user.cats.each {|cat| cat.update_attributes(:location_tag_list => ["#{Country.find(@user.country_id).name}-#{@user.city.capitalize}"])}
  end
end