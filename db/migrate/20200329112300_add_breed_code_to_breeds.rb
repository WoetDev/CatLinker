class AddBreedCodeToBreeds < ActiveRecord::Migration[6.0]
  def change
    add_column :breeds, :breed_code, :string
  end
end
