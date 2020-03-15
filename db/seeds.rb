# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# # BREEDS
# breeds = ['American Shorthair','Bengal','Birman','Bombay','British Shorthair','Burmese','Chartreux','Himalayan','Maine Coon','Munchkin','Nebelung','Norwegian Forest Cat','Persian','Ragamuffin','Ragdoll','Russian Blue','Scottish Fold','Siamese','Siberian','Sphynx']

# breeds.each do |name|
#   Breed.create(name: name)
# end

# UPDATE BREEDS INFORMATION
breeds = [ { id: 4, filepath: '../Images/bombay_placeholder.jpg', filename: 'bombay_placeholder.jpg' } ]

breeds.each do |breed_hash|
  breed_hash = breed_hash
  breed = Breed.find(breed_hash[:id])
  breed.picture.purge
  breed.picture.attach(io: File.open(breed_hash[:filepath]), filename: breed_hash[:filename], content_type: 'image/jpeg')
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
end

# # COUNTRIES
# countries = ['Belgium','France','The Netherlands','Germany']

# countries.each do |country|
#   Country.create(name: country)
# end