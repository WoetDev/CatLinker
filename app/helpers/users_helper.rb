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
    "#{user.city.capitalize} - #{I18n.t "countries.#{Country.find(user.country_id).country_code}"}"
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

  def kitten_parents(kitten)
    parents = Pair.find(kitten.pair_id)
    "#{parents.male.name.titlecase} & #{parents.female.name.titlecase}"
  end
end
