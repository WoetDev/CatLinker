class Message < MailForm::Base
  attribute :email,  :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attribute :cattery_name
  attribute :cattery_email
  attribute :subject, :validate => true
  attribute :description, :validate => true
  attribute :nickname,  :captcha  => true
  attribute :file, :attachment => true
  
  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => %(#{subject}),
      :to => %("#{cattery_name}" <#{cattery_email}>),
      :from => %("#{email}" <#{email}>),
    }
  end
end