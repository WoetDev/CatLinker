class AddDetailsToCats < ActiveRecord::Migration[6.0]
  def change
    remove_column :cats, :color
    add_column :cats, :tests, :text
    add_reference :cats, :color, null: false, foreign_key: true, default: 1
    add_reference :cats, :coat_pattern, null: false, foreign_key: true, default: 1
  end
end
