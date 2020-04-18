ActiveAdmin.register Cat do
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  permit_params :name, :gender, :age, :origin, :is_parent, :is_vaccinated, :is_castrated, :is_available, :user_id, :pair_id, :pairs_count, :litter_number, :birth_date, :breed_id, :tests, :color_id, :coat_pattern_id, :breed_tag_list, :location_tag_list
  
  index do
    selectable_column
    column :id
    column :user_id
    column :breed_tag_list
    column :location_tag_list
    column :is_available
    actions
  end
end
