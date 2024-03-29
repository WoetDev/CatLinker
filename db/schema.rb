# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_22_202632) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "breeds", force: :cascade do |t|
    t.bigint "cat_id"
    t.string "name"
    t.integer "cats_count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "short_description"
    t.string "personality"
    t.string "history"
    t.integer "playfulness"
    t.integer "activity_level"
    t.integer "friendliness_to_other_pets"
    t.integer "friendliness_to_children"
    t.integer "grooming_requirements"
    t.integer "vocality"
    t.integer "need_for_attention"
    t.integer "affection_toward_its_owners"
    t.integer "docility"
    t.integer "intelligence"
    t.integer "independence"
    t.integer "hardiness"
    t.string "slug"
    t.string "breed_code"
    t.string "name_en"
    t.string "name_nl"
    t.boolean "hidden", default: false
    t.index ["cat_id"], name: "index_breeds_on_cat_id"
    t.index ["slug"], name: "index_breeds_on_slug", unique: true
  end

  create_table "cats", force: :cascade do |t|
    t.string "name"
    t.string "gender"
    t.integer "age"
    t.string "origin"
    t.boolean "is_parent"
    t.boolean "is_vaccinated"
    t.boolean "is_castrated"
    t.boolean "is_available"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "pair_id"
    t.integer "pairs_count"
    t.integer "litter_number"
    t.datetime "birth_date"
    t.integer "breed_id"
    t.string "slug"
    t.text "tests"
    t.bigint "color_id", null: false
    t.bigint "coat_pattern_id", null: false
    t.text "pictures_dimensions"
    t.index ["coat_pattern_id"], name: "index_cats_on_coat_pattern_id"
    t.index ["color_id"], name: "index_cats_on_color_id"
    t.index ["pair_id"], name: "index_cats_on_pair_id"
    t.index ["slug"], name: "index_cats_on_slug", unique: true
    t.index ["user_id"], name: "index_cats_on_user_id"
  end

  create_table "cities", force: :cascade do |t|
    t.string "nis_code"
    t.string "postal_code"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "coat_patterns", force: :cascade do |t|
    t.string "name"
  end

  create_table "colors", force: :cascade do |t|
    t.string "name"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "country_code"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "pairs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "male_id", null: false
    t.integer "female_id", null: false
    t.index ["user_id"], name: "index_pairs_on_user_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "nis_code"
    t.string "name_en"
    t.string "name_nl"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "given_consent"
    t.boolean "is_cattery"
    t.string "cattery_name"
    t.string "certification_number"
    t.string "phone_number"
    t.string "street"
    t.string "number"
    t.string "postal_code"
    t.string "city"
    t.string "facebook_link"
    t.string "twitter_link"
    t.string "instagram_link"
    t.integer "cats_count"
    t.integer "pairs_count"
    t.boolean "is_admin", default: false
    t.integer "country_id"
    t.string "slug"
    t.string "provider"
    t.string "uid"
    t.string "region_nis_code"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "breeds", "cats"
  add_foreign_key "cats", "coat_patterns"
  add_foreign_key "cats", "colors"
  add_foreign_key "cats", "pairs"
  add_foreign_key "cats", "users"
  add_foreign_key "pairs", "users"
  add_foreign_key "taggings", "tags"
end
