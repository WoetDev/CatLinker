class ApplicationController < ActionController::Base
  include Pagy::Backend
  protect_from_forgery prepend: true
  before_action :authenticate_user!
end
