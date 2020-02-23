class Message < MailForm::Base
  attribute :email,  :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attribute :subject, :validate => true
  attribute :description, :validate => true

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => %("#{subject}"),
      :to => "wouter.bruynsteen@gmail.com",
      :from => %("#{email}" <#{email}>)
    }
  end
end