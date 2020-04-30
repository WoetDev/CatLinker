# Cron jobs - use separate scheduler addon on heroku
# set :chronic_options, hours24: true
# env 'MAILTO', 'support@catlinker.com'

# # Refresh the sitemap every day at 5 AM
# every 1.day, :at => '5:00' do
#   rake "-s sitemap:refresh"
# end

#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
