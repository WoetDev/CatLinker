module UsersHelper
  def cattery_breeds(user)
    user.cats.distinct.pluck(:breed_id)
  end

  def cattery_breed_names(user)
    breeds = user.cats.distinct.pluck(:breed_id)
    breed_names = ""

    breeds.each do |breed|
      unless breed == breeds.last
        breed_names << "#{Breed.find(breed).name}, "
      else
        breed_names << "#{Breed.find(breed).name}"
      end
    end

    return breed_names
  end

  def cattery_location(user)
    "#{user.city.capitalize} - #{Country.find(user.country_id).name}"
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
    Cat.user_id(user.id).is_parent(true).sort_by { |cat| [Breed.find(cat.breed_id).name, cat.gender] }
  end

  def cattery_pairs(user)
    Pair.user_id(user.id).sort_by { |pair| [Breed.find(Cat.find(pair.male_id).breed_id).name] }
  end

  def cattery_litters(user)
    Cat.user_id(user.id).is_parent(false).group(:litter_number).select('array_agg(id) as ids, litter_number').sort_by { |litter| litter.litter_number }.reverse
  end

  def cattery_kittens_per_litter(ids)
    Cat.where(id: ids)
  end

  def cattery_kittens(user)
    Cat.user_id(user.id).is_parent(false).sort_by { |cat| [Breed.find(cat.breed_id).name, cat.litter_number, cat.gender] }
  end
end
