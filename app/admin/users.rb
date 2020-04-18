ActiveAdmin.register User do
  permit_params :email, :reset_password_sent_at, :remember_created_at, :sign_in_count, :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email, :failed_attempts, :unlock_token, :locked_at, :given_consent, :is_cattery, :cattery_name, :certification_number, :phone_number, :street, :number, :postal_code, :city, :facebook_link, :twitter_link, :instagram_link, :cats_count, :pairs_count, :is_admin, :country_id

  index do
    selectable_column
    column :id
    column :email
    column :is_cattery
    column :country_id
    column :cats_count
    column :last_sign_in_at
    actions
  end
  
end
