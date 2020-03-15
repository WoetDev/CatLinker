class AddBreedInformationToBreeds < ActiveRecord::Migration[6.0]
  def change
    add_column :breeds, :short_description, :string
    add_column :breeds, :personality, :string
    add_column :breeds, :history, :string
    add_column :breeds, :playfulness, :integer
    add_column :breeds, :activity_level, :integer
    add_column :breeds, :friendliness_to_other_pets, :integer
    add_column :breeds, :friendliness_to_children, :integer
    add_column :breeds, :grooming_requirements, :integer
    add_column :breeds, :vocality, :integer
    add_column :breeds, :need_for_attention, :integer
    add_column :breeds, :affection_toward_its_owners, :integer
    add_column :breeds, :docility, :integer
    add_column :breeds, :intelligence, :integer
    add_column :breeds, :independence, :integer
    add_column :breeds, :hardiness, :integer
  end
end
