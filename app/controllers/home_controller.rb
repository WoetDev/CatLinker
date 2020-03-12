class HomeController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!

  def index
    @kittens = Cat.is_parent(false).last(4).reverse
    all_available_breeds
    @all_available_locations_array = []
  end

  def search
    all_available_breeds
    @all_available_locations_array = []
    redirect_to controller: "cats", action: "index", params: request.query_parameters and return
  end

  def contact
    @message = Message.new(params[:message])
  end

  private

  def set_user
    @user = current_user
  end

  def all_available_breeds
    breeds = Cat.is_parent(false).distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{Breed.find(breed).name}", Breed.find(breed).name] }.sort
  end
end
