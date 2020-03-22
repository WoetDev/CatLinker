class AddSlugToBreeds < ActiveRecord::Migration[6.0]
  def change
    add_column :breeds, :slug, :string
    add_index :breeds, :slug, unique: true
    add_column :cats, :slug, :string
    add_index :cats, :slug, unique: true
  end
end
