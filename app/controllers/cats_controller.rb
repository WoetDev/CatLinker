class CatsController < ApplicationController
  before_action :set_user
  skip_before_action :authenticate_user!, only: [:index, :show, :update_filters]

  def index
    all_available_breeds
    all_available_locations
    cats = Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true)

    if params[:breeds].present? or params[:locations].present?
      @breed_filter = params[:breeds].flatten.reject(&:blank?)
      @location_filter = params[:locations].flatten.reject(&:blank?)

      if @breed_filter.empty? && @location_filter.empty?
        @pagy, @kittens = pagy_countless(cats.order(created_at: :desc))
      elsif @location_filter.empty?
        @pagy, @kittens = pagy_countless(cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).order(created_at: :desc))
      elsif @breed_filter.empty?
        @pagy, @kittens = pagy_countless(cats.tagged_with(@location_filter, :on => :location_tag, :any => true).order(created_at: :desc))
      else
        @pagy, @kittens = pagy_countless(cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).tagged_with(@location_filter, :on => :location_tag, :any => true).order(created_at: :desc))
      end
    else
      @pagy, @kittens = pagy_countless(cats.order(created_at: :desc))
    end
  end

  def new
    @form = params[:form]
    @cat = Cat.new
    user = current_user
    all_colors
    all_coat_patterns

    if @form == 'parent'
      all_breeds
      all_countries
    elsif @form == 'kitten'
      parents(user)
      parent_breeds(user)
      litters(user)
    end
  end

  def create
    @form = params[:form]
    user = current_user
    all_colors
    all_coat_patterns
    

    if @form == 'parent'
      all_breeds
      all_countries
      @cat = Cat.new(parent_params)
      @cat.user_id = user.id
      @cat.name = custom_titleize(params[:cat][:name]) if params[:cat][:name].present?
      @cat.is_parent = true
      Cat.sanitize_filename(@cat.card_picture) if @cat.card_picture.attached?

      if @cat.save
        update_cat_breed_tags(@cat)
        update_cat_location_tags(@cat)

        flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                          kind: (I18n.t 'parent', count: 1), 
                          action: (I18n.t 'action.created'))
        redirect_to overview_cattery_path(user)
      else
        flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                        kind: (I18n.t 'parent', count: 1), 
                        action: (I18n.t 'action.created'))
        render 'new'
      end
    elsif @form == 'kitten'
      parents(user)
      parent_breeds(user)
      litters(user)

      @cat = Cat.new(kitten_params)
      @cat.user_id = user.id
      @cat.name = custom_titleize(params[:cat][:name]) if params[:cat][:name].present?
      @cat.is_parent = false

      Cat.sanitize_filename(@cat.card_picture) if @cat.card_picture.attached?
      if @cat.pictures.attached?
        @cat.pictures.each do |picture|
          Cat.sanitize_filename(picture)
        end
      end

      if @cat.save
        update_cat_breed_tags(@cat)
        update_cat_location_tags(@cat)
        update_litter_birth_date(@cat)

        flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                          kind: (I18n.t 'kitten', count: 1), 
                          action: (I18n.t 'action.created'))
        redirect_to overview_cattery_path(user)
      else
        flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                        kind: (I18n.t 'kitten', count: 1), 
                        action: (I18n.t 'action.created'))
        render 'new'
      end
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                      kind: (I18n.t 'cat', count: 1), 
                      action: (I18n.t 'action.created'))
      render 'new'
    end
  end

  def show
    @cat = Cat.friendly.find(params[:id])
    @user = User.find(@cat.user_id)
    @message = Message.new(params[:message])
  end

  def edit
    user = current_user
    @cat = user.cats.friendly.find(params[:id])
    @form = params[:form]

    if current_user == user
      all_colors
      all_coat_patterns

      if @form == 'parent'
        all_breeds
        all_countries
      elsif @form == 'kitten'
        parent_breeds(user)
        parents(user)
        litters(user)
        @cat.birth_date = @cat.birth_date.to_date.to_formatted_s(:rfc822)
      end
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.not_allowed", 
        kind: (I18n.t 'cat', count: 2).downcase,
        action: (I18n.t 'action.to_update'))
      redirect_back(fallback_location: root_path)
    end
  end

  def update
    user = current_user
    @cat = user.cats.friendly.find(params[:id])

    Cat.sanitize_filename(@cat.card_picture) if @cat.card_picture.attached?
    if @cat.pictures.attached?
      @cat.pictures.each do |picture|
        Cat.sanitize_filename(picture)
      end
    end

    @form = params[:form]

    if current_user == user
      all_colors
      all_coat_patterns
      @cat.name = custom_titleize(params[:cat][:name]) if params[:cat][:name].present?

      if @form == 'parent'
        all_breeds
        all_countries

        if @cat.update(parent_params)
          update_cat_breed_tags(@cat)
          update_cat_location_tags(@cat)

          flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                            kind: (I18n.t 'parent', count: 1), 
                            action: (I18n.t 'action.updated'))
          redirect_to overview_cattery_path(user)
        else
          flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                          kind: (I18n.t 'parent', count: 1), 
                          action: (I18n.t 'action.updated'))
          render 'edit'
        end
      elsif @form == 'kitten'
        parent_breeds(user)
        parents(user)
        litters(user)

        if @cat.update(kitten_params)
          update_cat_breed_tags(@cat)
          update_cat_location_tags(@cat)
          update_litter_birth_date(@cat)

          flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                            kind: (I18n.t 'kitten', count: 1), 
                            action: (I18n.t 'action.updated'))
          redirect_to overview_cattery_path(user)
        else
          flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                          kind: (I18n.t 'kitten', count: 1), 
                          action: (I18n.t 'action.updated'))
          render 'edit'
        end

      else
        flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                        kind: (I18n.t 'cat', count: 1),  
                        action: (I18n.t 'action.updated'))
        render 'edit'
      end
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.not_allowed", 
        kind: (I18n.t 'cat', count: 2).downcase,
        action: (I18n.t 'action.to_update'))
      redirect_back(fallback_location: root_path)
    end
  end

  def destroy
    @form = params[:form]
    user = current_user
    @cat = user.cats.friendly.find(params[:id])

    if current_user == user
      if @form == 'parent'
        if @cat.destroy
          flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                            kind: (I18n.t 'parent', count: 1), 
                            action: (I18n.t 'action.deleted'))
          redirect_to overview_cattery_path(user)
        else
          flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                          kind: (I18n.t 'parent', count: 1), 
                          action: (I18n.t 'action.deleted'))
          render 'edit'
        end
      elsif @form == 'kitten'
        if @cat.destroy
          flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                            kind: (I18n.t 'kitten', count: 1), 
                            action: (I18n.t 'action.deleted'))
          redirect_to overview_cattery_path(user)
        else
          flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                          kind: (I18n.t 'kitten', count: 1), 
                          action: (I18n.t 'action.deleted'))
          render 'edit'
        end
      else
        flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                        kind: (I18n.t 'cat', count: 1), 
                        action: (I18n.t 'action.updated'))
        render 'edit'
      end
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.not_allowed", 
        kind: (I18n.t 'cat', count: 2).downcase,
        action: (I18n.t 'action.to_delete'))
      redirect_back(fallback_location: root_path)
    end
  end

  def update_filters
    @breed_filter = params[:breeds]
    @location_filter = params[:locations]
    cats = Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true)
    users = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.where(cats: { is_parent: false, is_available: true })

    if params[:breeds].present?
      breed_ids = cats.tagged_with(@breed_filter, :on => :breed_tag, :any => true).distinct.pluck(:breed_id)   
      locations = users.where(cats: { is_parent: false, breed_id: breed_ids }).distinct.pluck(:city, :country_id)
    else
      locations = users.distinct.pluck(:city, :country_id)
    end

    if params[:locations].present?
      breeds = cats.tagged_with(@location_filter, :on => :location_tag, :any => true).distinct.pluck(:breed_id)
    else
      breeds = cats.distinct.pluck(:breed_id)
    end

    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{Breed.find(breed).breed_code}.name")}", Breed.find(breed).name] }.sort
    @all_available_locations_array = locations.map { |location| ["#{custom_titleize(location[0])} - #{(I18n.t "countries.#{Country.find(location[1]).country_code}")}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort

    render json: { breeds: @all_available_breeds_array, locations: @all_available_locations_array }
  end

  private

  def set_user
    @user = current_user
  end

  def parent_params
    params.require(:cat).permit(:name, :gender, :color, :origin, :card_picture, 
                                :hcm_dna, :hcm_echo, :pkd_dna, :pkd_echo, :fiv,
                                :felv, :pl, :sma, :is_parent, :breed_id, :coat_pattern_id, 
                                :color_id, :user_id, :breed_tag_list, :location_tag_list)
  end

  def kitten_params
    params.require(:cat).permit(:name, :gender, :color, :is_available, :is_vaccinated, 
                                :is_castrated, :card_picture, :breed_id, :coat_pattern_id, 
                                :color_id, :user_id, :pair_id, :litter_number, :birth_date, 
                                :breed_tag_list, :location_tag_list, pictures: [])
  end

  def all_available_breeds
    cats = Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true)
    breeds = cats.distinct.pluck(:breed_id)
    @all_available_breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{Breed.find(breed).breed_code}.name")}", Breed.find(breed).name] }.sort_by { |b| b[0] }
  end

  def all_available_locations
    users = User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.where(cats: { is_parent: false, is_available: true })
    locations = users.distinct.pluck(:city, :country_id)
    @all_available_locations_array = locations.map { |location| ["#{custom_titleize(location[0])} - #{(I18n.t "countries.#{Country.find(location[1]).country_code}")}", "#{Country.find(location[1]).name}-#{location[0].capitalize}"] }.uniq.sort_by { |l| l[0] }
  end

  def all_countries
    countries = Country.all
    @all_countries = countries.map { |c| [(I18n.t "countries.#{c.country_code}"), c.country_code] }.sort_by{|c| c[0]}
  end

  def all_breeds
    breeds = Breed.all
    @breeds_array = breeds.map { |breed| ["#{(I18n.t "breeds.#{breed.breed_code}.name")}", breed.id] }.sort_by { |b| b[0] }
  end

  def all_colors
    colors = Color.all
    @colors_array = colors.map { |color| ["#{(I18n.t "colors.#{color.name}")}".capitalize, color.id] }.sort_by { |c| c[0] }
  end

  def all_coat_patterns
    coats = CoatPattern.all
    @coat_patterns_array = coats.map { |coat| ["#{(I18n.t "coats.#{coat.name}")}".capitalize, coat.id] }.sort_by { |c| c[0] }
  end

  def parent_breeds(user)
    breeds = Cat.user_id(user.id).distinct.pluck(:breed_id)
    @breeds_array = breeds.map { |breed| [(I18n.t "breeds.#{Breed.find(breed).breed_code.upcase}.name"), Breed.find(breed).id] }.sort_by { |b| b[0] }
  end

  def parents(user)
    pairs = Pair.user_id(user.id)
    @parents_array = pairs.map { |pair| ["#{custom_titleize(pair.male.name)} & #{custom_titleize(pair.female.name)}", pair.id] }.sort_by { |b| b[0] }
  end

  def litters(user)
    litter_number_information = Cat.user_id(user.id).where.not(litter_number: nil).distinct.pluck(:litter_number, :pair_id, :birth_date)
    @litter_numbers = litter_number_information.reverse.map { |l| ["#{l[0]} - #{I18n.l(l[2].to_date, format: :default)} - #{custom_titleize(Pair.find(l[1]).male.name)} & #{custom_titleize(Pair.find(l[1]).female.name)}", l[0]] }.sort_by { |p| p[0] }.reverse
  end

  def update_cat_location_tags(cat)
    cat.update_attributes(:location_tag_list => ["#{Country.find(@user.country_id).name}-#{@user.city.capitalize}"])
  end

  def update_cat_breed_tags(cat)
    cat.update_attributes(:breed_tag_list => ["#{Breed.find(params[:cat][:breed_id]).name}"])
  end

  def update_litter_birth_date(cat)
    user = User.find(cat.user_id)
    kittens = Cat.user_id(user.id).is_parent(false).where(litter_number: cat.litter_number)
    kittens.each do |kitten| 
      kitten.update(birth_date: cat.birth_date.strftime('%Y-%m-%dT%H:%M:%S.000Z'))
    end
  end
end
