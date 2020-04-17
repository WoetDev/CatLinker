class RemoveDefaultColorAndCoatFromCats < ActiveRecord::Migration[6.0]
  def change
    change_column_default :cats, :color_id, nil
    change_column_default :cats, :coat_pattern_id, nil
  end
end
