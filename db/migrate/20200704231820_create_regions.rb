class CreateRegions < ActiveRecord::Migration[6.0]
  def change
    create_table :regions do |t|
      t.string :nis_code
      t.string :name_en
      t.string :name_nl

      t.timestamps
    end
  end
end
