class AddTranslationColumnsToBreeds < ActiveRecord::Migration[6.0]
  def change
    add_column :breeds, :name_en, :string
    add_column :breeds, :name_nl, :string
  end
end
