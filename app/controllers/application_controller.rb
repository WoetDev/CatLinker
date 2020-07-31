class ApplicationController < ActionController::Base
  include Pagy::Backend
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  protect_from_forgery prepend: true
  before_action :authenticate_user!, :set_locale, :default_url_options,
                :set_support, :set_user, :twitter_url_options

  private

  def set_locale
    I18n.locale = params[:locale] || http_accept_language.compatible_language_from(I18n.available_locales) || I18n.default_locale
  end

  def default_url_options(options = {})
    { locale: I18n.locale, host: ENV['DOMAIN'] || 'localhost:3000' }.merge options
  end

  def set_support
    @support = User.find_by(email: 'support@catlinker.com')
  end

  def set_user
    @user = current_user
  end

  # Twitter intent options
  def twitter_url_options
    params = {
      text: 'Cat Linker:',
      url: request.original_url
    }

    @tweet_url = "https://twitter.com/intent/tweet?#{params.to_query}"
  end

  # global methods
  def custom_titleize(string)
    original_str = string.split('')
    titleized_str = string.titleize.split('')
    compared_str = ""

    titleized_str.each_with_index do |char, index|
      if char.match(/[a-zA-Z0-9]/)
        compared_str += titleized_str[index]
      else
        compared_str += titleized_str[index].gsub(char, original_str[index])
      end
    end

    return compared_str
  end

  # error methods
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
