class AddCatteryInformationToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :given_consent, :boolean
    add_column :users, :is_cattery, :boolean
    add_column :users, :cattery_name, :string
    add_column :users, :certification_number, :string
    add_column :users, :phone_number, :string
    add_column :users, :street, :string
    add_column :users, :number, :string
    add_column :users, :postal_code, :string
    add_column :users, :city, :string
    add_column :users, :country, :string
    add_column :users, :facebook_link, :string
    add_column :users, :twitter_link, :string
    add_column :users, :instagram_link, :string
  end
end
