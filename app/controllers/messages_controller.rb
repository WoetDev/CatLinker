class MessagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :new, :create]

  def index
    @message = Message.new(params[:message])
  end

  def create
    @message = Message.new(params[:message])
    @message.request = request
    @user = User.find(params[:message][:user_id])
    if params[:message][:cat_id].present?
      @cat = Cat.find(params[:message][:cat_id])
    end

    recaptcha_valid = verify_recaptcha(model: @message, action: 'contact', minimum_score: 0.5)

    if recaptcha_valid
      respond_to do |format|
        if @message.deliver
          # re-initialize object for cleared form
          @message = Message.new
          # format.html { render 'cats/show'}
          format.js {  flash.now[:notice] = @flash_message = (I18n.t "form.contact.sent_success") }
        else
          # format.html { render 'cats/show' }
          format.js { flash.now[:alert] = @flash_message = (I18n.t "form.contact.sent_fail") }
        end
      end
    else
      flash[:alert] = I18n.t "recaptcha.errors.verification_failed"
    end
  end
end