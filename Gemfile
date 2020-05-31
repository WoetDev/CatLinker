source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.5'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.2', '>= 6.0.2.2'
# Use 'acts-as-taggable-on' to add tags to objects for filtering
gem 'acts-as-taggable-on'
# Use activeadmin for admin portal
gem 'activeadmin', '~> 2.7'
# Activestorage validation
gem 'activestorage-validator'
# Use Devise for user authentication
gem 'devise', '~> 4.7', '>= 4.7.1'
# Use figaro for setting environment variables
gem 'figaro'
# Fog for sitemap storage
gem 'fog-aws'
# Use friendly_id to use names in the url instead of ids
gem 'friendly_id'
# Use Hirb for fancier Rails Console output
gem 'hirb'
# Use i18n for translations of static content
gem 'i18n', '~> 1.8', '>= 1.8.2'
gem 'rails-i18n'
gem 'http_accept_language'
# Use mail_form gem for custom email forms
gem 'mail_form'
# Use premailer to inline email css with nokogiri dependency
gem 'nokogiri', '~> 1.10', '>= 1.10.9'
gem 'premailer-rails'
# Use omniauth for external logins
gem 'omniauth', '~> 1.9'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
# Use Pagy for pagination
gem 'pagy', '~> 3.7', '>= 3.7.3'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 4.3', '>= 4.3.5'
# Use ReCaptcha v3 for bot detection
gem 'recaptcha', '~> 5.5'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Generate XML sitemaps
gem 'sitemap_generator'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 4.0'
# Schedule cron jobs
gem 'whenever'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Use 'better_errors' to display more information on errors
  gem 'better_errors'
  # Use 'database_cleaner' gem for easy database wiping during development
  gem 'database_cleaner'
end

group :development do
  # Add foreman gem for faster Webpacker compiling during development
  gem 'foreman'
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

group :production do
  # GCS for production file storage
  gem 'google-cloud-storage', '~> 1.26', '>= 1.26.2'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
