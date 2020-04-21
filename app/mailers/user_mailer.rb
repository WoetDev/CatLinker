class UserMailer < Devise::Mailer   
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
  # If there is an object in your application that returns a contact email, you can use it as follows
  # Note that Devise passes a Devise::Mailer object to your proc, hence the parameter throwaway (*).
  default from: 'support@catlinker.com'

  def confirmation_instructions(record, token, opts={})
    add_logo_attachment
    super
  end

  def reset_password_instructions(record, token, opts={})
    add_logo_attachment
    super
  end

  def unlock_instructions(record, token, opts={})
    add_logo_attachment
    super
  end

  def email_changed(record, opts={})
    add_logo_attachment
    super
  end

  def password_change(record, opts={})
    add_logo_attachment
    super
  end

  private

  def add_logo_attachment
    attachments.inline["logo.png"] = File.read("#{Rails.root}/app/assets/images/logo.png")
  end
end