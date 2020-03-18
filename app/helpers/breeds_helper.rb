module BreedsHelper
  def cat_attribute_rating(breed, field)
    breed = Breed.find(breed.id)
    ratings = []

    5.times { |i|
      if i < breed[field]
        ratings.push(1)
      else
        ratings.push(0)
      end
    }

    return ratings
  end
end
