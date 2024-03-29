class Message < MailForm::Base
  attribute :email,  :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attribute :user_id
  attribute :cat_id
  attribute :cattery_name
  attribute :cattery_email
  attribute :subject, :validate => true
  attribute :description, :validate => true
  attribute :nickname,  :captcha  => true

  def email_to_name(email)
    name = email[/[^@]+/]
    name.gsub("_", ".").split(".").map {|n| n.capitalize }.join(" ")
  end

  def kitten_parents(kitten)
    parents = Pair.find(kitten.pair_id)
    "#{parents.male.name.titlecase} & #{parents.female.name.titlecase}"
  end

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => %(#{subject}),
      :to => %("#{cattery_name}" <#{cattery_email}>),
      :from => %("Cat Linker" <support@catlinker.com>),
      :reply_to => %("#{email_to_name(email)}" <#{email}>)
    }
  end
end