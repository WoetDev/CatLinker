class Breed < ApplicationRecord
  has_many :cats
  has_one_attached :picture

  # image processing
  def thumbnail
    picture.variant(resize: '500x500').processed
  end

  def vertical_rectangle
    picture.variant(resize_to_fill: [ 500, 600, gravity: 'Center' ])
  end

  def icon_thumbnail
    picture.variant(resize: '100x100').processed
  end
end
