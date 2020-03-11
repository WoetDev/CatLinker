Rails.application.routes.draw do
  devise_for :users, :controllers => {:confirmations => 'users/confirmations', registrations: 'users/registrations' }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.htmlµ
  root 'home#index'
  get 'home/search' => 'home#search'

  resources :home, only: [:index] do
    member do
      get 'contact' => 'home#contact'
    end
  end

  resources :users, path: 'catteries', as: 'catteries', only: [:index, :show ] do
    member do 
      get 'my_cattery' => 'users#my_cattery', as: 'my_cattery'
      post 'my_cattery' => 'users#update_cattery'
      get 'cattery/overview' => 'users#cattery_overview', as: 'overview'
      get 'parent_filters' => 'users#parent_filters'
    end
  end

  get 'cats/new_litter' => 'users#new_litter'
  get 'cats/birth_date' => 'users#birth_date'
  get 'cats/update_filters' => 'cats#update_filters'
  get 'users/update_filters' => 'users#update_filters'
  

  resources :cats
  resources :pairs
  resources :messages, only: [:index, :new, :create]
end
