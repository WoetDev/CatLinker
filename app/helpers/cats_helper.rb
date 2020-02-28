module CatsHelper
  def cat_location(cat)
    "#{User.find(cat.user_id).city.capitalize} - #{Country.find(User.find(cat.user_id).country_id).name}"
  end

  def cat_father(cat)
    Cat.find(Pair.find(cat.pair_id).male_id)
  end

  def cat_mother(cat)
    Cat.find(Pair.find(cat.pair_id).female_id)
  end

  def other_kittens_from_same_litter(cat)
    Cat.where.not(id: cat.id).where(user_id: cat.user_id, litter_number: cat.litter_number)
  end
end
