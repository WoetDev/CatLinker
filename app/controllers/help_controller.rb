class HelpController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @guides = [{title: 'what_is_catlinker', description: 'learn_about_catlinker'}]
    @gradients = ['purple', 'green', 'green-variant', 'red']
  end

  def what_is_catlinker
    @video_title = "#{I18n.locale.upcase}_CATLINKER_INTRO"
  end
end
