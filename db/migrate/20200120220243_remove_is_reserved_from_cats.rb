class RemoveIsReservedFromCats < ActiveRecord::Migration[6.0]
  def change

    remove_column :cats, :is_reserved, :boolean
  end
end
