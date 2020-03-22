class ApplicationController < ActionController::Base
  include Pagy::Backend
  protect_from_forgery prepend: true
  before_action :authenticate_user!, :set_support, :set_user, :twitter_url_options

  private

  def set_support
    @support = User.find_by(email: 'support@catlinker.com')
  end

  def set_user
    @user = current_user
  end

  def default_url_options
    { host: ENV['DOMAIN'] || 'localhost:3000' }
  end

  def twitter_url_options
    params = {
      text: 'Check this out on Cat Linker!',
      url: request.original_url
    }

    @tweet_url = "https://twitter.com/intent/tweet?#{params.to_query}"
  end
end
