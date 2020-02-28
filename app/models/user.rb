class User < ApplicationRecord
  belongs_to :country, optional: true
  has_many :cats
  has_many :pairs
  has_one_attached :profile_picture

  # image processing
  def thumbnail
    profile_picture.variant(resize: '500x500').processed
  end

  # filter
  acts_as_tagger

  # scopes
  scope :is_cattery, -> (is_cattery) { where is_cattery: is_cattery }

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable,
         :trackable, :omniauthable

  # validation conditions
  def is_cattery?
    is_cattery == true
  end
  
  # custom validations
  validates :given_consent, presence: true
  # validates :cattery_name, presence: true, if: :is_cattery?
  # validates :profile_picture, presence: true, if: :is_cattery?
  # validates :postal_code, presence: true, if: :is_cattery?
  # validates :city, presence: true, if: :is_cattery?
  # validates :country_id, presence: true, if: :is_cattery?
end
