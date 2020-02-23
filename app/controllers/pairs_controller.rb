class PairsController < ApplicationController

  def new
    @form = params[:form]
    @pair = Pair.new
    @user = current_user

    males = Cat.user_id(current_user.id).is_parent(true).gender('1')
    @male_cats_array = males.map { |cat| [cat.name, cat.id] }

    females = Cat.user_id(current_user.id).is_parent(true).gender('2')
    @female_cats_array = females.map { |cat| [cat.name, cat.id] }
  end

  def create
    @form = params[:form]
    user = current_user

    get_males(user)
    get_females(user)
    
    @pair = Pair.new(pair_params)
    @pair.user_id = user.id

    if @form == 'pair'
      if @pair.save
        flash[:notice] = 'Pair was successfully created'
        redirect_to overview_cattery_path(user)
      else
        flash[:alert] = 'There was a problem with creating this pair'
        render 'new'
      end
    end
  end

  def edit
    @form = params[:form]
    @pair = Pair.find_by(id: params[:id])
    @user = @pair.user

    get_males(@user)
    get_females(@user)
  end

  def update
    @form = params[:form]
    @pair = Pair.find_by(id: params[:id])
    user = @pair.user

    get_males(user)
    get_females(user)

    if @pair.update(pair_params)
      flash[:notice] = 'Pair was successfully updated'
      redirect_to overview_cattery_path(user)
    else
      flash[:alert] = 'There was a problem with updating this pair'
      render 'edit'
    end
  end

  def destroy
    @form = params[:form]
    @pair = Pair.find_by(id: params[:id])
    user = @pair.user

    if @form == 'pair'
      if @pair.destroy
        flash[:notice] = 'Pair was successfully deleted'
        redirect_to overview_cattery_path(user)
      end
    end
  end

  private

  def pair_params
    params.require(:pair).permit(:user_id, :male_id, :female_id)
  end

  def get_males(user)
    males = Cat.user_id(user.id).is_parent(true).gender('1')
    @male_cats_array = males.map { |cat| [cat.name, cat.id] }
  end

  def get_females(user)
    females = Cat.user_id(user.id).is_parent(true).gender('2')
    @female_cats_array = females.map { |cat| [cat.name, cat.id] }
  end
end
