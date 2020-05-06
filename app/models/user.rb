class User < ApplicationRecord
  extend FriendlyId
  belongs_to :country, optional: true
  has_many :cats, dependent: :destroy
  has_many :pairs, dependent: :destroy
  has_one_attached :profile_picture, dependent: :destroy

  # friendly_id
  friendly_id :cattery_name, use: :slugged

  def should_generate_new_friendly_id?
    cattery_name_changed? || super
  end

  # image processing
  def thumbnail
    profile_picture.variant(resize_to_fill: [ 500, 500, gravity: 'Center' ]).processed
  end

  def facebook_thumbnail
    profile_picture.variant(resize_to_fill: [ 600, 314, gravity: 'Center' ]).processed
  end

  def twitter_thumbnail
    profile_picture.variant(resize_to_fill: [ 600, 335, gravity: 'Center' ]).processed
  end

  # filter tags
  acts_as_tagger

  # scopes
  scope :is_cattery, -> (is_cattery) { where is_cattery: is_cattery }
  scope :cattery_information_present, -> { where.not(cattery_name: [nil, ""]).where.not(postal_code: [nil, ""]).where.not(city: [nil, ""]) }

  # Include devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable,
         :trackable, :omniauthable, omniauth_providers: [:facebook, :google_oauth2]

  # external logins
  def self.from_facebook_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.is_cattery = false
      user.given_consent = true
      user.provider = auth.provider
      user.uid = auth.uid

      # user.skip_confirmation!
    end
  end

  def self.from_google_oauth2_omniauth(access_token)
    data = access_token.info
    user = User.where(provider: access_token.provider, uid: access_token.uid).first

    unless user
      user = User.create( email: data['email'],
                          password: Devise.friendly_token[0,20],
                          provider: access_token.provider,
                          uid: access_token.uid,
                          given_consent: true )
      # user.skip_confirmation!
    end
    user
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  # validation methods
  def is_cattery?
    is_cattery == true  
  end

  # validations
  validates :given_consent, presence: true, on: :create

  validates :cattery_name, 
            :profile_picture, 
            :postal_code, 
            :city, 
            :country_id, presence: true, if: :is_cattery?, on: :required_cattery_information
  validate  :image_type, if: :is_cattery?, on: :required_cattery_information

  private

  def image_type
    if profile_picture.attached? && !profile_picture.content_type.in?(%('image/jpeg image/png'))
      profile_picture.purge
      errors.add(:profile_picture, (I18n.t 'form.errors.invalid_image_file_type'))
    end
  end
end
