module CatsHelper
  def cat_location(cat)
    user = User.find(cat.user_id)
    country = Country.find(user.country_id)
    location = "#{user.city.capitalize} - #{I18n.t "countries.#{country.country_code}"}"

    if user.region_nis_code.present? and find_region(user).present?
      region = " (#{(I18n.t "cat_info.region").downcase} #{I18n.t "regions.#{find_region(user)}"})"
      location = location.concat(region)
    else
      location = location
    end
    location = capitalized_name(location)
  end
  
  def kitten_pictures_dimensions(cat, image)
    cat.pictures_dimensions[image]
  end

  def cat_father(cat)
    Cat.find(Pair.find(cat.pair_id).male_id)
  end

  def cat_mother(cat)
    Cat.find(Pair.find(cat.pair_id).female_id)
  end

  def cat_coat(cat)
    "#{I18n.t "coats.#{CoatPattern.find(cat.coat_pattern.id).name}"} #{I18n.t "colors.#{Color.find(cat.color.id).name}"}".capitalize
  end

  def other_kittens_from_same_litter(cat)
    Cat.where.not(id: cat.id).where(user_id: cat.user_id, litter_number: cat.litter_number)
  end
end
