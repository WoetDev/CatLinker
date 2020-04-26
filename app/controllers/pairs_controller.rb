class PairsController < ApplicationController
  def index
    redirect_to overview_cattery_path(@user)
  end

  def new
    @form = params[:form]
    @pair = Pair.new
    @user = current_user

    male_cats(@user)
    female_cats(@user)
  end

  def create
    @form = params[:form]
    user = current_user
    @pair = Pair.new(pair_params)
    @pair.user_id = user.id

    male_cats(user)
    female_cats(user)

    if @pair.save
      flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                        kind: (I18n.t 'pair', count: 1), 
                        action: (I18n.t 'action.created'))
      redirect_to overview_cattery_path(user)
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                      kind: (I18n.t 'pair', count: 1), 
                      action: (I18n.t 'action.created'))
      render 'new'
    end
  end

  def edit
    @form = params[:form]
    @pair = Pair.find(params[:id])
    @user = @pair.user

    male_cats(@user)
    female_cats(@user)
  end

  def update
    @form = params[:form]
    @pair = Pair.find(params[:id])
    user = @pair.user

    male_cats(user)
    female_cats(user)

    if @pair.update(pair_params)
      flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                        kind: (I18n.t 'pair', count: 1), 
                        action: (I18n.t 'action.updated'))
      redirect_to overview_cattery_path(user)
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                      kind: (I18n.t 'pair', count: 1), 
                      action: (I18n.t 'action.updated'))
      render 'edit'
    end
  end

  def destroy
    @form = params[:form]
    @pair = Pair.find(params[:id])
    user = @pair.user

    if @pair.destroy
      flash[:notice] = (I18n.t "cattery_overview.toast.successful_action", 
                        kind: (I18n.t 'pair', count: 1), 
                        action: (I18n.t 'action.deleted'))
      redirect_to overview_cattery_path(user)
    else
      flash[:alert] = (I18n.t "cattery_overview.toast.failed_action", 
                      kind: (I18n.t 'pair', count: 1), 
                      action: (I18n.t 'action.deleted'))
      render 'edit'
    end
  end

  private

  def pair_params
    params.require(:pair).permit(:user_id, :male_id, :female_id)
  end

  def male_cats(user)
    males = Cat.user_id(user.id).is_parent(true).gender('1')
    @male_cats_array = males.map { |cat| [cat.name, cat.id, data: {"icon": url_for(cat.icon_thumbnail)}] }
  end

  def female_cats(user)
    females = Cat.user_id(user.id).is_parent(true).gender('2')
    @female_cats_array = females.map { |cat| [cat.name, cat.id, data: {"icon": url_for(cat.icon_thumbnail)}] }
  end
end
