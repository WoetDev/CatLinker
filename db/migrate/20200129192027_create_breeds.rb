class CreateBreeds < ActiveRecord::Migration[6.0]
  def change
    create_table :breeds do |t|
      t.references :cat, null: true, foreign_key: true
      t.string :name
      t.integer :cats_count

      t.timestamps
    end

    add_column :cats, :breed_id, :integer
    remove_column :cats, :breed, :string
  end
end
