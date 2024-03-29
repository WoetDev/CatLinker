class Pair < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :male, :class_name => 'Cat', counter_cache: true
  belongs_to :female, :class_name => 'Cat', counter_cache: true

  # scopes
  scope :user_id, -> (user_id) { where user_id: user_id }
  scope :male_id, -> (male_id) { where male_id: male_id }
  scope :female_id, -> (female_id) { where female_id: female_id }  

  # validations
  validates_presence_of :male_id
  validates_presence_of :female_id
  validate :pair_has_two_different_breeds
  validate :pair_already_exists, on: :create

  # validation methods with error messages
  def pair_already_exists
    if Pair.user_id(user_id).where(male_id: male_id, female_id: female_id).any?
      errors.add(:male_id, (I18n.t 'form.errors.pair_already_exists'))
      errors.add(:female_id, "")
    end
  end

  def pair_has_two_different_breeds
    if Cat.find(male_id).breed_id != Cat.find(female_id).breed_id
      errors.add(:male_id, (I18n.t 'form.errors.pair_has_two_different_breeds'))
      errors.add(:female_id, "")
    end
  end
end