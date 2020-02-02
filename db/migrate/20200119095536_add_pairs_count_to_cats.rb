class AddPairsCountToCats < ActiveRecord::Migration[6.0]
  def change
    add_column :cats, :pairs_count, :integer
  end
end
