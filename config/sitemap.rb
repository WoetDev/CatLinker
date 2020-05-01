# Set the host name for URL creation
require 'fog/aws'

SitemapGenerator::Sitemap.default_host = "http://www.catlinker.com"
SitemapGenerator::Sitemap.compress = false
SitemapGenerator::Sitemap.create_index = true
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
  {en: :english, nl: :dutch}.each_pair do |locale, name|
    group(:sitemaps_path => "sitemaps/#{locale}/", :filename => name) do
      add root_path(locale: locale), :priority => 1, :changefreq => 'daily'

      add cats_path(locale: locale), :priority => 1, :changefreq => 'always'
      Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true).find_each do |cat|
        add cat_path(cat, locale: locale), :priority => 0.9, :changefreq => 'always', :lastmod => cat.updated_at
      end

      add catteries_path(locale: locale), :priority => 1, :changefreq => 'always'
      User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.find_each do |cattery|
        add cattery_path(cattery, locale: locale), :priority => 0.9, :changefreq => 'always', :lastmod => cattery.updated_at
      end

      add breeds_path(locale: locale), :priority => 0.8, :changefreq => 'weekly'
      Breed.find_each do |breed|
        add breed_path(breed, locale: locale), :priority => 0.7, :changefreq => 'weekly', :lastmod => breed.updated_at
      end
    end
  end

  group(:filename => 'general') do 
    add privacy_policy_path, :changefreq => 'monthly'
    add terms_of_service_path, :changefreq => 'monthly'
    add cookies_policy_path, :changefreq => 'monthly'
  end
end
