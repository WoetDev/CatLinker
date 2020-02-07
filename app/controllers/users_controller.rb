class UsersController < ApplicationController
  before_action :set_user, only: [:my_cattery, :update_cattery]

  def my_cattery
    @user = current_user
    get_all_countries
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
    user.cats.each {|cat| cat.update_attributes(:location_tag_list => ["#{Country.find(@user.country_id).name}", "#{@user.city.capitalize}"])}
  end
end