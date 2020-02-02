class UsersController < ApplicationController
  before_action :set_user, only: [:my_cattery, :update_cattery]

  def my_cattery
    @user = current_user
  end

  def update_cattery
    if @user.update(cattery_params)
      flash[:notice] = 'Cattery information was successfully updated'
      render 'my_cattery'
    else
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
    :number, :postal_code, :city, :country, :phone_number, :facebook_link,
    :instagram_link, :twitter_link)
  end
end
