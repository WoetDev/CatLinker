ActiveAdmin.register Breed do
  permit_params :cat_id, :name, :cats_count, :short_description, :personality, :history, :playfulness, :activity_level, :friendliness_to_other_pets, :friendliness_to_children, :grooming_requirements, :vocality, :need_for_attention, :affection_toward_its_owners, :docility, :intelligence, :independence, :hardiness, :breed_code
  
  index do
    actions
    column :id
    column :breed_code
    column :name
    column :cats_count
    column :playfulness
    column :activity_level
    column :friendliness_to_other_pets
    column :friendliness_to_children
    column :grooming_requirements
    column :vocality
    column :need_for_attention
    column :affection_toward_its_owners
    column :docility
    column :intelligence
    column :independence
    column :hardiness
  end
end
