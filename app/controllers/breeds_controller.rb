class BreedsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    all_available_breeds

    if params[:breeds_filter].present?
      breed_filter = params[:breeds_filter].flatten.reject(&:blank?)

      if breed_filter.empty?
        @pagy, @breeds = pagy_countless(Breed.where(hidden: false).order("name_#{I18n.locale} ASC"))
      else
        @pagy, @breeds = pagy_countless(Breed.where(id: breed_filter).distinct(:id).order("name_#{I18n.locale} ASC"))
      end
    else
      @pagy, @breeds = pagy_countless(Breed.where(hidden: false).order("name_#{I18n.locale} ASC"))
    end
  end

  def show
    @breed = Breed.friendly.find(params[:id])
    @properties_array = ['playfulness','activity_level','friendliness_to_other_pets',
                        'friendliness_to_children','grooming_requirements','vocality',
                        'need_for_attention','affection_toward_its_owners','docility', 
                        'intelligence', 'independence', 'hardiness']
    @catteries = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.where(cats: { breed_id: @breed.id })
    @kittens = Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true).where(breed_id: @breed.id)
  end

  private

  def all_available_breeds
    breeds = Breed.where(hidden: false)
    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{breed.breed_code}.name")}", breed.id, data: {"icon": url_for(breed.icon_thumbnail)}] }.sort_by{|b| b[0]}
  end
end