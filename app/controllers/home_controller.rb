class HomeController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!
  
  def index
    @kittens = Cat.is_parent(false).last(4).reverse
  end

  private

  def set_user
    @user = current_user
  end
end
