class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :authenticate_user!, only: [:facebook, :google_oauth2, :failure]

  def facebook
    @user = User.from_facebook_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      handle_redirect('devise.facebook_data', 'Facebook')
    else
      session["devise.facebook_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def google_oauth2
    @user = User.from_google_oauth2_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      handle_redirect('devise.google_data', 'Google')
    else
      session['devise.google_data'] = request.env['omniauth.auth'][:info].except(:extra) # Removing extra as it can overflow some session stores
      redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
    end
  end

  def failure
    redirect_to root_path
  end

  private

  def handle_redirect(_session_variable, kind)
    # Use the session locale set earlier; use the default if it isn't available.
    I18n.locale = session[:omniauth_login_locale] || I18n.default_locale
    sign_in_and_redirect @user, event: :authentication
    set_flash_message(:notice, :success, kind: kind) if is_navigational_format?
  end
end