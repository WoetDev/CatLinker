module UsersHelper
  def cattery_breeds(user)
    breeds = user.cats.distinct.pluck(:breed_id)
    Breed.friendly.find(breeds)
  end

  def cattery_breed_names(user)
    breeds = user.cats.distinct.pluck(:breed_id)
    breed_names = ""

    breeds.each do |breed|
      unless breed == breeds.last
        if breeds.length > 1 and breed == breeds[-2]
          breed_names << "#{I18n.t "breeds.#{Breed.find(breed).breed_code}.name"} #{I18n.t "words.and"} "
        else
          breed_names << "#{I18n.t "breeds.#{Breed.find(breed).breed_code}.name"}, "
        end
      else
        breed_names << "#{I18n.t "breeds.#{Breed.find(breed).breed_code}.name"}"
      end
    end

    return breed_names
  end

  def cattery_location(user)
    country = Country.find(user.country_id)
    location = "#{user.city.capitalize} - #{I18n.t "countries.#{country.country_code}"}"

    if user.region_nis_code.present? and find_region(user).present?
      region = " (#{(I18n.t "cat_info.region").downcase} #{I18n.t "regions.#{find_region(user)}"})"
      location = location.concat(region)
    else
      location = location
    end
  end

  def cattery_parent_count(user)
    parents = Cat.user_id(user.id).is_parent(true)
    males = parents.gender(1)
    females = parents.gender(2)

    @parents_count = { parents: parents.count, males: males.count, females: females.count }
  end

  def cattery_litter_count(user)
    Cat.user_id(user.id).is_parent(false).distinct.pluck(:litter_number).count
  end

  def cattery_kitten_count(user)
    Cat.user_id(user.id).is_parent(false).count
  end

  def cattery_kittens_available(user)
    Cat.user_id(user.id).is_parent(false).sort_by{ |cat| cat.is_available ? 0 : 1 }.first
  end

  def cattery_social_links(user)
    facebook_link = user.facebook_link.sub(/^https?\:\/\/(www.)?/,'')
    instagram_link = user.instagram_link.sub(/^https?\:\/\/(www.)?/,'')
    twitter_link = user.twitter_link.sub(/^https?\:\/\/(www.)?/,'')

    @social_links = { facebook: facebook_link, instagram: instagram_link, twitter: twitter_link }
  end

  def cattery_parents(user)
    Cat.user_id(user.id).is_parent(true).sort_by { |cat| [(I18n.t "breeds.#{Breed.find(cat.breed_id).breed_code}.name"), cat.gender, cat.name] }
  end

  def cattery_kittens_per_litter(ids)
    Cat.where(id: ids)
  end

  def find_region(user)
    if user.region_nis_code.present?
      arrondissement = user.region_nis_code[0,2]
      region = Region.where(nis_code: arrondissement).first

      region.nis_code unless region.name_nl.downcase == user.city.downcase
    end
  end
end
