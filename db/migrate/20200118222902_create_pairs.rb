class CreatePairs < ActiveRecord::Migration[6.0]
  def change
    create_table :pairs do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :male_id, null: false
      t.integer :female_id, null: false
    end
  end
end
