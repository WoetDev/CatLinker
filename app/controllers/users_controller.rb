class UsersController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index

  end

  def show
    @user = User.find(params[:id])
  end

  def my_cattery
    get_all_countries

    if @user.cattery_name.blank? or @user.postal_code.blank? or @user.city.blank? or @user.country_id.blank?
      required_info = [@user.cattery_name, @user.postal_code, @user.city, @user.country_id]
      required_info_strings = ["cattery name", "postal code", "city", "country"]
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

  def update_cattery
    get_all_countries

    if @user.update(cattery_params)
      update_cat_location_tags(@user)
      flash[:notice] = 'Cattery information was successfully updated'
      render 'my_cattery'
    else
      flash[:alert] = 'There was a problem updating your cattery information'
      render 'my_cattery'
    end
  end

  def cattery_overview
    @parents = Cat.user_id(current_user.id).is_parent(true)
    @pairs = Pair.user_id(current_user.id)
    @kittens = Cat.user_id(current_user.id).is_parent(false)

    @male_parents = Cat.user_id(current_user.id).is_parent(true).gender('1')
    @female_parents = Cat.user_id(current_user.id).is_parent(true).gender('2')
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

  private

  def set_user
    @user = current_user
  end

  def cattery_params
    params.require(:user).permit(:cattery_name, :certification_number, :street,
    :number, :postal_code, :city, :country_id, :phone_number, :facebook_link,
    :instagram_link, :twitter_link)
  end

  def get_all_countries
    countries = Country.all.sort
    @all_countries = countries.map { |c| [c.name, c.id] }.sort_by{|c| c[0]}
  end

  def update_cat_location_tags(user)
    user.cats.each {|cat| cat.update_attributes(:location_tag_list => ["#{Country.find(@user.country_id).name}-#{@user.city.capitalize}"])}
  end
end