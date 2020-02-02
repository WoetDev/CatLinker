module ApplicationHelper
  def cat_gender(cat)
    if cat.gender == '1'
      'Male'
    else
      'Female'
    end
  end

  def cat_breed(cat)
    Breed.find_by(id: cat.breed_id).name
  end

  def cattery_name(cat)
    User.find_by(id: cat.user_id).cattery_name
  end

  def parent_litters_count(cat)
    if cat.gender == '1'
      pairs = Pair.user_id(current_user.id).male_id(cat.id)
    else
      pairs = Pair.user_id(current_user.id).female_id(cat.id)
    end

    cats_array = []

    pairs.each do |pair|
      cat = Cat.user_id(current_user.id).pair_id(pair.id)
      cats_array.push(cat)
    end

    @count = 0

    cats_array.each do |kittens|
      @count += kittens.group_by{|l| l[:litter_number]}.size
    end

    return @count
  end

  def parent_kittens_count(cat)
    if cat.gender == '1'
      pairs = Pair.user_id(current_user.id).male_id(cat.id)
    else
      pairs = Pair.user_id(current_user.id).female_id(cat.id)
    end

    cats_array = []

    pairs.each do |pair|
      cat = Cat.user_id(current_user.id).pair_id(pair.id)
      cats_array.push(cat)
    end

    @count = 0

    cats_array.each do |kittens|
      @count += kittens.size
    end

    return @count
  end

  def pair_litters_count(pair)
    Cat.user_id(current_user.id).pair_id(pair.id).group(:litter_number).count.size
  end

  def pair_kittens_count(pair)
    Cat.user_id(current_user.id).pair_id(pair.id).size
  end
end
