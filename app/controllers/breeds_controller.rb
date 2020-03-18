class BreedsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    all_available_breeds

    if params[:breeds_filter].present?
      breed_filter = params[:breeds_filter].flatten.reject(&:blank?)

      if breed_filter.empty?
        @breeds = Breed.all.sort_by{ |breed| breed[:name] }
      else
        @breeds = Breed.where(id: breed_filter).sort_by{ |breed| breed[:name] }
      end
    else
      @breeds = Breed.all.sort_by{ |breed| breed[:name] }
    end
  end

  def show
    @breed = Breed.find(params[:id])
    @properties_array = ['playfulness','activity_level','friendliness_to_other_pets',
                        'friendliness_to_children','grooming_requirements','vocality',
                        'need_for_attention','affection_toward_its_owners','docility', 
                        'intelligence', 'independence', 'hardiness']
    users = User.joins(:cats).where(cats: { breed_id: @breed.id }).distinct.pluck(:id)
    @catteries = User.find(users)
    @kittens = Cat.is_parent(false).where(breed_id: @breed.id)
  end

  private

  def all_available_breeds
    breeds = Breed.all
    @all_available_breeds_array = breeds.map { |breed| ["#{breed.name}", breed.id, data: {"icon": url_for(breed.icon_thumbnail)}] }.sort
  end
end