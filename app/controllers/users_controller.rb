class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update_cattery, :cattery_overview, :show_filters]
  skip_before_action :authenticate_user!, only: [:index, :show, :update_filters, :show_filters]

  def index
    @user = current_user
    cats = Cat.joins(:user).where(users: { is_cattery: true })
    users = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present

    all_available_breeds
    all_available_locations

    if params[:breeds].present? or params[:locations].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      @location_filter = params[:locations].flatten.reject(&:blank?)
      
      if @breed_filter.empty? && @location_filter.empty?
        @pagy, @catteries = pagy_countless(users.order(cats_count: :desc))
      elsif @location_filter.empty?
        breed_ids = cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)
        @pagy, @catteries = pagy_countless(users.where(cats: { breed_id: breed_ids }).order(cats_count: :desc))
      elsif @breed_filter.empty?
        cat_ids = cats.tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:id)
        @pagy, @catteries = pagy_countless(users.where(cats: { id: cat_ids }).order(cats_count: :desc))
      else
        cat_ids = cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:id)
        @pagy, @catteries = pagy_countless(users.where(cats: { id: cat_ids }).order(cats_count: :desc))
      end
    else
      @pagy, @catteries = pagy_countless(users.order(cats_count: :desc))
    end
  end

  def show
    @message = Message.new(params[:message])

    all_cattery_parents(@user)
    all_cattery_litters(@user)

    cattery_pairs(@user)
    cattery_litters(@user)
    cattery_kittens(@user)
  end

  def my_cattery
    @user = current_user

    all_countries
    check_required_cattery_information(@user)
    tooltip_change_email(@user)
  end

  def update_cattery
    all_countries
    tooltip_change_email(@user)

    if @user.update(cattery_params) and @user.valid?(:required_cattery_information)
      update_cat_location_tags(@user)
      check_required_cattery_information(@user)  
      flash.now[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                        kind: (I18n.t 'cattery_overview.cattery_information'), 
                        action: (I18n.t 'action.updated'))
      render 'my_cattery'
    else
      check_required_cattery_information(@user)
      flash.now[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                      kind: (I18n.t 'cattery_overview.cattery_information'), 
                      action: (I18n.t 'action.updated'))
      render 'my_cattery'
    end
  end

  def cattery_overview
    if current_user == @user
      @parents = Cat.user_id(@user.id).is_parent(true).sort_by { |cat| [(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name"), cat.gender, cat.name] }
      @pairs = Pair.user_id(@user.id).sort_by { |pair| [Breed.find(Cat.find(pair.male_id).breed_id).name] }
      @kittens = Cat.user_id(@user.id).is_parent(false).sort_by{|c| [c.litter_number, c.updated_at]}.reverse

      @male_parents = Cat.user_id(@user.id).is_parent(true).gender('1')
      @female_parents = Cat.user_id(@user.id).is_parent(true).gender('2')
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.not_allowed", 
                      kind: (I18n.t 'cattery_overview.cattery_overview_reference').downcase,
                      action: (I18n.t 'action.to_view'))
      redirect_back(fallback_location: root_path)
    end
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
    cats = Cat.joins(:user).where(users: { is_cattery: true })
    users = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present

    if params[:breeds].present?
      breed_ids = cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)
      locations = users.where(cats: { breed_id: breed_ids }).distinct.pluck(:city, :country_id)
    else
      locations = users.distinct.pluck(:city, :country_id)
    end

    if params[:locations].present?
      breed_ids = cats.tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:breed_id)
      breeds = users.where(cats: { breed_id: breed_ids }).distinct.pluck(:breed_id)
    else
      breeds = users.distinct.pluck(:breed_id)
    end

    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{Breed.find(breed).breed_code}.name")}", Breed.find(breed).name] }.sort
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{(I18n.t "countries.#{Country.find(location[1]).country_code}")}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort

    render json: { breeds: @all_available_breeds_array, locations: @all_available_locations_array }
  end

  def show_filters
    if params[:parents_filter].present?
      parents_filter = params[:parents_filter].flatten.reject(&:blank?)
      pair_ids = Pair.user_id(@user.id).where(male_id: parents_filter).or(Pair.user_id(@user.id).where(female_id: parents_filter)).pluck(:id)
      litter_number_information = Cat.user_id(@user.id).is_parent(false).where(pair_id: pair_ids).group(:litter_number).select('litter_number, array_agg(pair_id) as pair_ids, array_agg(birth_date) as birth_dates, array_agg(id) as ids').sort_by { |litter| litter.litter_number }.reverse
      @all_litters = litter_number_information.pluck(:litter_number, :pair_ids, :birth_dates).reverse.map { |l| ["#{I18n.l(l[2][0].to_date, format: :default)} - #{Pair.find_by(id: l[1][0]).male.name.titlecase} & #{Pair.find_by(id: l[1][0]).female.name.titlecase}", l[0]] }
    else
      litter_number_information = Cat.user_id(@user.id).where.not(litter_number: nil).distinct.pluck(:litter_number, :pair_id, :birth_date)
      @all_litters = litter_number_information.reverse.map { |l| ["#{I18n.l(l[2].to_date, format: :default)} - #{Pair.find_by(id: l[1]).male.name.titlecase} & #{Pair.find_by(id: l[1]).female.name.titlecase}", l[0]] }
    end

    render json: { litters_filter: @all_litters }
  end

  private

  def set_user
    @user = User.friendly.find(params[:id]) or not_found
  end

  def cattery_params
    params.require(:user).permit(:cattery_name, :certification_number, :street,
    :number, :postal_code, :city, :country_id, :phone_number, :facebook_link,
    :instagram_link, :twitter_link, :profile_picture)
  end

  def all_available_breeds
    cats = Cat.joins(:user).where(users: { is_cattery: true })
    breeds = cats.distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{Breed.find(breed).breed_code}.name")}", Breed.find(breed).name] }.sort
  end

  def all_available_locations
    users = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present
    locations = users.distinct.pluck(:city, :country_id)
    @all_available_locations_array = locations.map { |location| ["#{location[0].capitalize} - #{(I18n.t "countries.#{Country.find(location[1]).country_code}")}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort
  end

  def all_cattery_parents(user)
    cats = Cat.user_id(user.id).is_parent(true).sort_by { |cat| [(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name"), cat.gender, cat.name] }
    @all_parents = cats.map { |cat| ["#{cat.name.titlecase}", cat.id, data: {"icon": url_for(cat.icon_thumbnail)}] }
  end

  def all_cattery_litters(user)
    litter_number_information = Cat.user_id(user.id).where.not(litter_number: nil).distinct.pluck(:litter_number, :pair_id, :birth_date)
    @all_litters = litter_number_information.reverse.map { |l| ["#{I18n.l(l[2].to_date, format: :default)} - #{Pair.find_by(id: l[1]).male.name.titlecase} & #{Pair.find_by(id: l[1]).female.name.titlecase}", l[0]] }
  end

  def cattery_pairs(user)
    if params[:parents_filter].present?
      parents_filter = params[:parents_filter].flatten.reject(&:blank?)

      if parents_filter.empty?
        @pairs = Pair.user_id(user.id).sort_by { |pair| [Breed.find(Cat.find(pair.male_id).breed_id).name] }
      else
        @pairs = Pair.user_id(user.id).where(male_id: parents_filter).or(Pair.user_id(user.id).where(female_id: parents_filter)).sort_by { |pair| [Breed.find(Cat.find(pair.male_id).breed_id).name] }
      end
    else
      @pairs = Pair.user_id(user.id).sort_by { |pair| [Breed.find(Cat.find(pair.male_id).breed_id).name] }
    end
  end

  def cattery_litters(user)
    if params[:parents_filter].present?
      parents_filter = params[:parents_filter].flatten.reject(&:blank?)

      if parents_filter.empty?
        @litters = Cat.user_id(user.id).is_parent(false).group(:litter_number).select('array_agg(id) as ids, litter_number').sort_by { |litter| litter.litter_number }.reverse
      else
        pair_ids = Pair.user_id(user.id).where(male_id: parents_filter).or(Pair.user_id(user.id).where(female_id: parents_filter)).pluck(:id)
        @litters = Cat.user_id(user.id).is_parent(false).where(pair_id: pair_ids).group(:litter_number).select('array_agg(id) as ids, litter_number').sort_by { |litter| litter.litter_number }.reverse
      end
    else
      @litters = Cat.user_id(user.id).is_parent(false).group(:litter_number).select('array_agg(id) as ids, litter_number').sort_by { |litter| litter.litter_number }.reverse
    end
  end

  def cattery_kittens(user)
    if params[:parents_filter].present?
      parents_filter = params[:parents_filter].flatten.reject(&:blank?)
    end

    if params[:litters_filter].present?
      litters_filter = params[:litters_filter].flatten.reject(&:blank?)
    end

    if params[:parents_filter].present? or params[:litters_filter].present?
      if params[:litters_filter] && litters_filter.any?
        @kittens = Cat.user_id(user.id).is_parent(false).where(litter_number: litters_filter).sort_by { |cat| ["#{(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name")}", cat.litter_number, cat.gender] }
      elsif params[:parents_filter] && parents_filter.any?
        pair_ids = Pair.user_id(user.id).where(male_id: parents_filter).or(Pair.user_id(user.id).where(female_id: parents_filter)).pluck(:id)
        @kittens = Cat.user_id(user.id).is_parent(false).where(pair_id: pair_ids).sort_by { |cat| ["#{(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name")}", cat.litter_number, cat.gender] }
      else
        @kittens = Cat.user_id(user.id).is_parent(false).sort_by { |cat| ["#{(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name")}", cat.litter_number, cat.gender] }
      end
    else
      @kittens = Cat.user_id(user.id).is_parent(false).sort_by { |cat| ["#{(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name")}", cat.litter_number, cat.gender] }
    end
  end

  def all_countries
    countries = Country.all
    @all_countries = countries.map { |c| [(I18n.t "countries.#{c.country_code}"), c.id] }.sort_by{|c| c[0]}
  end

  def check_required_cattery_information(user)
    if user.profile_picture.blank? or user.cattery_name.blank? or user.postal_code.blank? or user.city.blank? or user.country_id.blank?
      required_info = [user.profile_picture, user.cattery_name, user.postal_code, user.city, user.country_id]
      required_info_strings = [(I18n.t "my_cattery.profile_picture"), 
                               (I18n.t "my_cattery.cattery_name"), 
                               (I18n.t "my_cattery.postal_code"), 
                               (I18n.t "my_cattery.city"), 
                               (I18n.t "my_cattery.country")]
      blank_required_info_array = []

      required_info.each.with_index do |info, index|
        if info.blank?
          blank_required_info_array.push(required_info_strings[index].downcase)
        end
      end

      if blank_required_info_array.size > 1
        blank_required_info_string = blank_required_info_array.take(blank_required_info_array.size-1).join(', ')
        blank_required_info_string = "#{blank_required_info_string} #{I18n.t "words.and"} #{blank_required_info_array.last}"
      else
        blank_required_info_string = blank_required_info_array.join
      end

      @required_info_message = (I18n.t "my_cattery.required_information_message", missing_info: blank_required_info_string)
    end
  end

  def tooltip_change_email(user)
    if user.provider.present?
      @change_email_path = "javascript:void(0)"
      @change_email_tooltip = I18n.t "my_cattery.tooltip.provider", provider: user.provider[/[^_]+/].capitalize
    else
      @change_email_path = edit_user_registration_path
      @change_email_tooltip = I18n.t "my_cattery.tooltip.profile"
    end
  end

  def update_cat_location_tags(user)
    user.cats.each {|cat| cat.update_attributes(:location_tag_list => ["#{Country.find(@user.country_id).name}-#{@user.city.capitalize}"])}
  end
end