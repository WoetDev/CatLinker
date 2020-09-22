class AddHiddenToBreeds < ActiveRecord::Migration[6.0]
  def change
    add_column :breeds, :hidden, :boolean, default: false
  end
end
