module ApplicationHelper
  include Pagy::Frontend

  def cat_gender(cat)
    if cat.gender == '1'
      I18n.t 'male', count: 1
    else
      I18n.t 'female', count: 1
    end
  end

  def cat_breed(cat)
    Breed.find(cat.breed_id)
  end

  def format_birth_date(cat)
    cat.birth_date.to_date.to_formatted_s(:rfc822)
  end

  def cattery(cat)
    User.find(cat.user_id)
  end

  def cattery_user(user)
    User.find(user.id)
  end
  
  def parent_litters_count(cat, user)
    if cat.gender == '1'
      pairs = Pair.user_id(user.id).male_id(cat.id)
    else
      pairs = Pair.user_id(user.id).female_id(cat.id)
    end

    cats_array = []

    pairs.each do |pair|
      cat = Cat.user_id(user.id).pair_id(pair.id)
      cats_array.push(cat)
    end

    @count = 0

    cats_array.each do |kittens|
      @count += kittens.group_by{|l| l[:litter_number]}.size
    end

    return @count
  end

  def parent_kittens_count(cat, user)
    if cat.gender == '1'
      pairs = Pair.user_id(user.id).male_id(cat.id)
    else
      pairs = Pair.user_id(user.id).female_id(cat.id)
    end

    cats_array = []

    pairs.each do |pair|
      cat = Cat.user_id(user.id).pair_id(pair.id)
      cats_array.push(cat)
    end

    @count = 0

    cats_array.each do |kittens|
      @count += kittens.size
    end

    return @count
  end

  def pair_litters_count(pair, user)
    Cat.user_id(user.id).pair_id(pair.id).group(:litter_number).count.size
  end

  def pair_kittens_count(pair, user)
    Cat.user_id(user.id).pair_id(pair.id).size
  end
end
