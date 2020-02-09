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

  def other_pictures(input)
    pictures[input]
  end

  # filter
  acts_as_taggable_on :breed_tag
  acts_as_taggable_on :location_tag

  include PgSearch::Model

  pg_search_scope :kitten_search,
                  against: [:name ],
                  associated_against: {
                  breeds: :name,
                  },
                  using: {
                    tsearch: {any_word: true}
                  }

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
  validates :name, presence: true, unless: :is_kitten?
  validates :name, length: { maximum: 15 }
  validates :breed, presence: true
  validates :gender, presence: true
  validates :color, presence: true
  validates :card_picture, presence: true
  validates :litter_number, presence: true, if: :is_kitten?
  validates :birth_date, presence: true, if: :is_kitten?
  validates :pair_id, presence: true, if: :is_kitten?
end
