class Cat < ApplicationRecord
  extend FriendlyId
  store :tests, accessors: [:hcm_dna, :hcm_echo, :pkd_dna, :pkd_echo, :fiv, :felv]

  belongs_to :user, counter_cache: true
  belongs_to :breed, counter_cache: true
  belongs_to :color
  belongs_to :coat_pattern
  has_many :pairs
  has_many :countries
  has_one_attached :card_picture
  has_many_attached :pictures

  # friendly_id
  friendly_id :slug_candidates, use: :slugged

  def slug_candidates
    breed.name if breed_id.present?
  end

  def should_generate_new_friendly_id?
    breed_id_changed? || super
  end

  # image processing
  def thumbnail
    card_picture.variant(resize: '350x350').processed
  end

  def icon_thumbnail
    card_picture.variant(resize: '100x100').processed
  end

  def facebook_thumbnail
    card_picture.variant(resize_to_fill: [ 600, 314, gravity: 'Center' ]).processed
  end

  def twitter_thumbnail
    card_picture.variant(resize_to_fill: [ 600, 335, gravity: 'Center' ]).processed
  end

  def square
    card_picture.variant(resize_to_fill: [ 500, 500, gravity: 'Center' ])
  end

  def other_pictures(input)
    pictures[input]
  end

  # filename sanitization
  def self.sanitize_filename(file)
    file.filename.sanitized
  end

  # filter tags
  acts_as_taggable_on :breed_tag
  acts_as_taggable_on :location_tag

  # scopes
  scope :user_id, -> (user_id) { where user_id: user_id }
  scope :pair_id, -> (pair_id) { where pair_id: pair_id }
  scope :is_parent, -> (is_parent) { where is_parent: is_parent }
  scope :is_available, -> (is_available) { where is_available: is_available }
  scope :gender, -> (gender) { where gender: gender }

  # validation methods
  def is_kitten?
    is_parent == false
  end

  # validations
  validates :name, presence: true, unless: :is_kitten?
  validates :name, length: { maximum: 15 }
  validates :breed_id, 
            :color_id, 
            :coat_pattern_id, 
            :gender, 
            :card_picture, presence: true
  validates :litter_number, 
            :birth_date, 
            :pair_id, presence: true, if: :is_kitten?

  validates :pictures, blob: { content_type: :image, size_range: 1..75.megabytes  }

  validate :image_type
  validate :parent_name_already_exists, unless: :is_kitten?
  validate :parent_breed_is_different_than_kitten_breed, :parents_dont_own_selected_litter, if: :is_kitten?

  private

  # validation methods with error messages
  def image_type
    if card_picture.attached? && !card_picture.content_type.in?(%('image/jpeg image/png'))
      card_picture = nil
      errors.add(:card_picture, (I18n.t 'form.errors.invalid_image_file_type'))
    end
  end

  def parent_name_already_exists
    if Cat.user_id(user_id).is_parent(true).where.not(id: id).where(name: name).any?
      errors.add(:name, (I18n.t 'form.errors.parent_name_already_exists'))
    end
  end

  def parent_breed_is_different_than_kitten_breed
    if breed_id.present? and pair_id.present? and breed_id != Cat.find(Pair.find(pair_id).male_id).breed_id
      errors.add(:breed_id, (I18n.t 'form.errors.parent_breed_is_different_than_kitten_breed'))
      errors.add(:pair_id, (I18n.t 'form.errors.parent_breed_is_different_than_kitten_breed'))
    end
  end

  def parents_dont_own_selected_litter
    parent_litters = Cat.user_id(user_id).is_parent(false).pair_id(pair_id).distinct.pluck(:litter_number)
    last_litter_number = Cat.user_id(user_id).is_parent(false).distinct.pluck(:litter_number).max

    unless litter_number.blank? or pair_id.blank? or litter_number.to_i > last_litter_number.to_i or parent_litters.include?(litter_number)
      errors.add(:pair_id, (I18n.t 'form.errors.parents_dont_own_selected_litter'))
      errors.add(:litter_number, (I18n.t 'form.errors.parents_dont_own_selected_litter'))
    end
  end
end
