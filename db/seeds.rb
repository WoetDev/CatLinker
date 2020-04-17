# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# # CAT COLORS AND COAT PATTERNS
# coats = [{ id: 1, name: 'solid' }, { id: 2, name: 'bi_colour' }, { id: 3, name: 'tabby' }, { id: 4, name: 'tortoiseshell' }, { id: 5, name: 'tri_color_calico' }, { id: 6, name: 'colour_point' }]
# colors = [{ id: 1, name: 'black' }, { id: 2, name: 'blue' }, { id: 3, name: 'brown' }, { id: 4, name: 'cinnamon' }, { id: 5, name: 'cream' }, { id: 6, name: 'fawn' }, { id: 7, name: 'grey' }, { id: 8, name: 'red_ginger' }, { id: 9, name: 'white' }]

# coats.each do |hash|
#   coat = CoatPattern.find(hash[:id])
#   coat.update(name: hash[:name])
# end

# colors.each do |hash|
#   color = Color.find(hash[:id])
#   color.update(name: hash[:name])
# end

# # BREEDS
# breeds = { id: 1, name: 'American Shorthair', breed_code: 'AS' },{ id: 2, name: 'Bengal', breed_code: 'BG' },{ id: 3, name: 'Birman', breed_code: 'BI' },{ id: 4, name: 'Bombay', breed_code: 'BO' },{ id: 5, name: 'British Shorthair', breed_code: 'BS' },{ id: 6, name: 'Burmese', breed_code: 'BU' },{ id: 7, name: 'Chartreux', breed_code: 'CX' },{ id: 8, name: 'Himalayan', breed_code: 'HI' },{ id: 9, name: 'Maine Coon', breed_code: 'MC' },{ id: 10, name: 'Munchkin', breed_code: 'MK' },{ id: 11, name: 'Nebelung', breed_code: 'NB' },{ id: 12, name: 'Norwegian Forest Cat', breed_code: 'NF' },{ id: 13, name: 'Persian', breed_code: 'PS' },{ id: 14, name: 'Ragamuffin', breed_code: 'RM' },{ id: 15, name: 'Ragdoll', breed_code: 'RD' },{ id: 16, name: 'Russian Blue', breed_code: 'RB' },{ id: 17, name: 'Scottish Fold', breed_code: 'SF' },{ id: 18, name: 'Siamese', breed_code: 'SI' },{ id: 19, name: 'Siberian', breed_code: 'SB' },{ id: 20, name: 'Sphynx', breed_code: 'SX' }

# breeds.each do |breed_hash|
#   breed = Breed.find(breed_hash[:id])
#   breed.update(breed_code: breed_hash[:breed_code])
# end

# UPDATE BREEDS INFORMATION
# breeds = [ { id: 10, filepath: '../Images/munchkin_placeholder.jpg', filename: 'munchkin_placeholder.jpg' } ]

# breeds.each do |breed_hash|
#   breed_hash = breed_hash
#   breed = Breed.find(breed_hash[:id])
#   breed.picture.purge
#   breed.picture.attach(io: File.open(breed_hash[:filepath]), filename: breed_hash[:filename], content_type: 'image/jpeg')
  # breed.update( short_description: breed_hash[:short_description]
                # personality: breed_hash[:personality],
                # history: breed_hash[:history],
                # playfulness: breed_hash[:playfulness],
                # activity_level: breed_hash[:activity_level],
                # friendliness_to_other_pets: breed_hash[:friendliness_to_other_pets],
                # friendliness_to_children: breed_hash[:friendliness_to_children],
                # grooming_requirements: breed_hash[:grooming_requirements],
                # vocality: breed_hash[:vocality],
                # need_for_attention: breed_hash[:need_for_attention],
                # affection_toward_its_owners: breed_hash[:affection_toward_its_owners],
                # docility: breed_hash[:docility],
                # intelligence: breed_hash[:intelligence],
                # independence: breed_hash[:independence],
                # hardiness: breed_hash[:hardiness]
# )
# end

# # COUNTRIES

# countries.each do |country_hash|
#   country = Country.find(country_hash[:id])
#   country.update(name: country_hash[:name], country_code: country_hash[:country_code])
# end