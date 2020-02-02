class AddPairIdToCats < ActiveRecord::Migration[6.0]
  def change
    add_reference :cats, :pair, null: true, foreign_key: true
  end
end
