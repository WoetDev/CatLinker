class CreateCats < ActiveRecord::Migration[6.0]
  def change
    create_table :cats do |t|
      t.string :name
      t.string :breed
      t.string :gender
      t.integer :age
      t.string :color
      t.string :origin
      t.boolean :is_parent
      t.boolean :is_vaccinated
      t.boolean :is_castrated
      t.boolean :is_available
      t.boolean :is_reserved
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
