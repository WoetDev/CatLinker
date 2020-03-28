Rails.application.routes.draw do
  devise_for :users, only: :omniauth_callbacks, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  
  scope "(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    root 'home#index'
    # We define here a route inside the locale that just saves the current locale in the session
    get 'omniauth/:provider' => 'omniauth#localized', as: :localized_omniauth

    devise_for :users, :controllers => { confirmations: 'users/confirmations', 
                                        registrations: 'users/registrations',
                                        omniauth_callbacks: 'users/omniauth_callbacks' }, skip: :omniauth_callbacks
    # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.htmlµ

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
        get 'show_filters' => 'users#show_filters'
      end
    end

    get 'cats/new_litter' => 'users#new_litter'
    get 'cats/birth_date' => 'users#birth_date'
    get 'cats/update_filters' => 'cats#update_filters'
    get 'users/update_filters' => 'users#update_filters'

    resources :breeds, only: [:index, :show]
    resources :cats
    resources :pairs
    resources :messages, only: [:index, :new, :create]
  end
end
