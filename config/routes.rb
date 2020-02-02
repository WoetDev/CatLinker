Rails.application.routes.draw do
  devise_for :users, :controllers => {:confirmations => 'users/confirmations', registrations: 'users/registrations' }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.htmlµ
  root 'home#index'
  get 'cattery' => 'users#my_cattery'
  post 'cattery' => 'users#update_cattery'
  get 'cattery/overview' => 'users#cattery_overview'

  get 'cats/new_litter' => 'users#new_litter'
  get 'cats/birth_date' => 'users#birth_date'

  resources :cats
  resources :pairs
end
