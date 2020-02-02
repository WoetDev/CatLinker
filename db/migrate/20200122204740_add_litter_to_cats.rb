class AddLitterToCats < ActiveRecord::Migration[6.0]
  def change
    add_column :cats, :litter_number, :integer
    add_column :cats, :birth_date, :datetime
    add_column :users, :cats_count, :integer
    add_column :users, :pairs_count, :integer
  end
end
