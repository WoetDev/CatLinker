class AddCountryCodeToCountries < ActiveRecord::Migration[6.0]
  def change
    add_column :countries, :country_code, :string
  end
end
