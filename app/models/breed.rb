class Breed < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :cats
  has_one_attached :picture

  # image processing
  def thumbnail
    picture.variant(resize: '500x500').processed
  end

  def facebook_thumbnail
    picture.variant(resize_to_fill: [ 600, 600, gravity: 'Center' ]).processed
  end

  def twitter_thumbnail
    picture.variant(resize_to_fill: [ 500, 550, gravity: 'Center' ]).processed
  end

  def vertical_rectangle
    picture.variant(resize_to_fill: [ 500, 600, gravity: 'Center' ])
  end

  def icon_thumbnail
    picture.variant(resize: '100x100').processed
  end
end
