class CreateCities < ActiveRecord::Migration[6.0]
  def change
    create_table :cities do |t|
      t.string :nis_code
      t.string :postal_code
      t.string :name

      t.timestamps
    end
  end
end
