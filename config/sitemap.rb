# Set the host name for URL creation
require 'fog/aws'

SitemapGenerator::Sitemap.default_host = "http://www.catlinker.com"

SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new(fog_provider: ENV['FOG_PROVIDER'],
                                                                    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
                                                                    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
                                                                    fog_directory: ENV['FOG_DIRECTORY'],
                                                                    fog_region: ENV['FOG_REGION']) 
# pick a place safe to write the files
SitemapGenerator::Sitemap.public_path = 'tmp/'
# store on S3 using Fog (pass in configuration values as shown above if needed)
SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new
# inform the map cross-linking where to find the other maps
SitemapGenerator::Sitemap.sitemaps_host = "http://s3-#{ENV['FOG_REGION']}.amazonaws.com/#{ENV['FOG_DIRECTORY']}/"
# pick a namespace within your bucket to organize your maps
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'

SitemapGenerator::Sitemap.ping_search_engines('http://www.catlinker.com/sitemap')

SitemapGenerator::Sitemap.create do
  {en: :english, nl: :dutch}.each_pair do |locale, name|
    group(:sitemaps_path => "sitemaps/#{locale}/", :filename => name) do
      add root_path(locale: locale), :changefreq => 'daily'

      add cats_path, :changefreq => 'always'
      Cat.joins(:user).where(users: { is_cattery: true }).is_parent(false).is_available(true).find_each do |cat|
        add cat_path(cat), :priority => '1.0', :changefreq => 'always', :lastmod => cat.updated_at
      end

      add catteries_path, :changefreq => 'always'
      User.is_cattery(true).distinct(:id).joins(:cats).joins(:country).cattery_information_present.find_each do |cattery|
        add cattery_path(cattery), :priority => '1.0', :changefreq => 'always', :lastmod => cattery.updated_at
      end

      add breeds_path, :changefreq => 'weekly'
      Breed.find_each do |breed|
        add breed_path(breed), :priority => '0.8', :changefreq => 'weekly', :lastmod => breed.updated_at
      end

    end
  end
  
  add privacy_policy_path, :changefreq => 'monthly'
  add terms_of_service_path, :changefreq => 'monthly'
  add cookies_policy_path, :changefreq => 'monthly'
  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  #
  # Usage: add(path, options={})
  #        (default options are used if you don't specify)
  #
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host
  #
  # Examples:
  #
  # Add '/articles'
  #
  #   add articles_path, :priority => 0.7, :changefreq => 'daily'
  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end
end
