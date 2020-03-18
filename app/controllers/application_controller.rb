class ApplicationController < ActionController::Base
  include Pagy::Backend
  protect_from_forgery prepend: true
  before_action :authenticate_user!, :set_support, :set_user

  private

  def set_support
    @support = User.find_by(email: "support@catlinker.com")
  end
  
  def set_user
    @user = current_user
  end
end
