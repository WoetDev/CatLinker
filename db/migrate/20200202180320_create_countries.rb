class CreateCountries < ActiveRecord::Migration[6.0]
  def change
    create_table :countries do |t|
      t.string :name
    end

    add_column :users, :country_id, :integer
    remove_column :users, :country, :string
  end
end
