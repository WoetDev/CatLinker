class User < ApplicationRecord
  has_many :cats
  has_many :pairs

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable,
         :trackable, :omniauthable
  
  # custom validations
  validates :given_consent, presence: true
end
