class AddPicturesDimensionsToCats < ActiveRecord::Migration[6.0]
  def change
    add_column :cats, :pictures_dimensions, :text
  end
end
