class AddRegionToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :region_nis_code, :string
  end
end
