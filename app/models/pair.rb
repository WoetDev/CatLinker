class Pair < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :male, :class_name => 'Cat', counter_cache: true
  belongs_to :female, :class_name => 'Cat', counter_cache: true

  # scopes
  scope :user_id, -> (user_id) { where user_id: user_id }
  scope :male_id, -> (male_id) { where male_id: male_id }
  scope :female_id, -> (female_id) { where female_id: female_id }

  # validations
  validates :male_id, presence: true
  validates :female_id, presence: true
end