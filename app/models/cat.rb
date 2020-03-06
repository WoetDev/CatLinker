class Cat < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :breed, counter_cache: true
  has_many :pairs
  has_many :countries
  has_one_attached :card_picture
  has_many_attached :pictures

  # image processing
  def thumbnail
    card_picture.variant(resize: '500x500').processed
  end

  def icon_thumbnail
    card_picture.variant(resize: '100x100').processed
  end

  def square
    card_picture.variant(resize_to_fill: [ 500, 500, gravity: 'Center' ])
  end

  def other_pictures(input)
    pictures[input]
  end

  # filter
  acts_as_taggable_on :breed_tag
  acts_as_taggable_on :location_tag

  # scopes
  scope :user_id, -> (user_id) { where user_id: user_id }
  scope :pair_id, -> (pair_id) { where pair_id: pair_id }
  scope :is_parent, -> (is_parent) { where is_parent: is_parent }
  scope :gender, -> (gender) { where gender: gender }

  # validation conditions
  def is_kitten?
    is_parent == false
  end

  # validations
  validate :image_type

  validates :name, presence: true, unless: :is_kitten?
  validates :name, length: { maximum: 15 }
  validates :breed, presence: true
  validates :gender, presence: true
  validates :color, presence: true
  validates :card_picture, presence: true
  validates :litter_number, presence: true, if: :is_kitten?
  validates :birth_date, presence: true, if: :is_kitten?
  validates :pair_id, presence: true, if: :is_kitten?

  private

  def image_type
    if !card_picture.content_type.in?(%('image/jpeg image/png'))
      errors.add(:card_picture, "Only jpeg or png files are allowed")
    end
  end
end
