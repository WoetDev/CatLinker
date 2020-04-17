class CreateColors < ActiveRecord::Migration[6.0]
  def change
    create_table :colors do |t|
      t.string :name
    end
    create_table :coat_patterns do |t|
      t.string :name
    end
  end
end
