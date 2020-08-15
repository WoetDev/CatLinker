# Set the host name for URL creation
require 'fog/aws'

SitemapGenerator::Sitemap.default_host = "http://www.catlinker.com"
SitemapGenerator::Sitemap.create_index = :auto
SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new(fog_provider: ENV['FOG_PROVIDER'],
                                                                    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
                                                                    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
                                                                    fog_directory: ENV['FOG_DIRECTORY'],
                                                                    fog_region: ENV['FOG_REGION']) 
# pick a place safe to write the files
SitemapGenerator::Sitemap.public_path = 'tmp/'
# inform the map cross-linking where to find the other maps
SitemapGenerator::Sitemap.sitemaps_host = "http://s3-#{ENV['FOG_REGION']}.amazonaws.com/#{ENV['FOG_DIRECTORY']}/"
# pick a namespace within your bucket to organize your maps
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'
# ping Google & Bing from redirect route
SitemapGenerator::Sitemap.ping_search_engines('http://www.catlinker.com/sitemap')

SitemapGenerator::Sitemap.create do
  add(root_path, :alternates => [{
    :href => 'http://www.catlinker.com/en',
    :lang => 'en'
  }, 
  {
    :href => 'http://www.catlinker.com/nl',
    :lang => 'nl'
  }])

  add(cats_path, :priority => 1, :changefreq => 'always', :alternates => [{
    :href => 'http://www.catlinker.com/en/cats',
    :lang => 'en'
  }, 
  {
    :href => 'http://www.catlinker.com/nl/cats',
    :lang => 'nl'
  }])

  Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true).find_each.with_index do |cat, index|
    cats_alternates = []
    {en: :english, nl: :dutch}.each_pair do |locale, name|
      alternate = {
        :href => "http://www.catlinker.com#{cat_path(cat, locale: locale)}",
        :lang => locale.to_s
      }
      cats_alternates.push(alternate)
    end

    add(cat_path(cat), :priority => 0.9, :changefreq => 'always', :lastmod => cat.updated_at, :alternates => cats_alternates)
  end

  add(catteries_path, :priority => 1, :changefreq => 'always', :alternates => [{
    :href => 'http://www.catlinker.com/en/catteries',
    :lang => 'en'
  }, 
  {
    :href => 'http://www.catlinker.com/nl/catteries',
    :lang => 'nl'
  }])

  User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.find_each do |cattery|
    catteries_alternates = []
    {en: :english, nl: :dutch}.each_pair do |locale, name|
      alternate = {
        :href => "http://www.catlinker.com#{cattery_path(cattery, locale: locale)}",
        :lang => locale.to_s
      }
      catteries_alternates.push(alternate)
    end

    add(cattery_path(cattery), :priority => 0.9, :changefreq => 'always', :lastmod => catteries.updated_at, :alternates => catteries_alternates)
  end

  add(breeds_path, :priority => 1, :changefreq => 'always', :alternates => [{
    :href => 'http://www.catlinker.com/en/breeds',
    :lang => 'en'
  }, 
  {
    :href => 'http://www.catlinker.com/nl/breeds',
    :lang => 'nl'
  }])

  Breed.find_each do |breed|
    breeds_alternates = []
    {en: :english, nl: :dutch}.each_pair do |locale, name|
      alternate = {
        :href => "http://www.catlinker.com#{breed_path(breed, locale: locale)}",
        :lang => locale.to_s
      }
      breeds_alternates.push(alternate)
    end

    add(breed_path(breed, locale: locale), :priority => 0.7, :changefreq => 'weekly', :lastmod => breed.updated_at, :alternates => breeds_alternates)
  end

  add privacy_policy_path, :changefreq => 'monthly'
  add terms_of_service_path, :changefreq => 'monthly'
  add cookies_policy_path, :changefreq => 'monthly'
end
