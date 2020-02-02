class HomeController < ApplicationController
  skip_before_action :authenticate_user!
  
  def index
    @kittens = Cat.is_parent(false).last(4).reverse
  end
end
