class HomeController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!

  def sitemap
    redirect_to 'http://s3-eu-west-3.amazonaws.com/cat-linker/sitemaps/sitemap.xml.gz'
  end

  def index
    all_available_breeds
    @all_available_locations_array = []
    @breeds = Breed.where.not(cats_count: nil).sort_by{|b| b.cats_count}.reverse.take(8)
    @kittens = Cat.is_parent(false).last(4).reverse
  end

  def search
    all_available_breeds
    @all_available_locations_array = []
    redirect_to controller: "cats", action: "index", params: request.query_parameters and return
  end

  def contact
    @message = Message.new(params[:message])
  end

  def terms_of_service
  end

  def privacy_policy
  end

  def cookies_policy
  end

  private

  def set_user
    @user = current_user
  end

  def all_available_breeds
    cats = Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true)
    breeds = cats.distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{Breed.find(breed).breed_code}.name")}", Breed.find(breed).name] }.sort_by { |b| b[0] }
  end
end
