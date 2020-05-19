Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users, only: :omniauth_callbacks, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  # redirect for sitemap
  get '/sitemap', to: 'home#sitemap'

  # error pages from root
  match '/404' => "errors#not_found", via: :all
  match '/422' => "errors#unacceptable", via: :all
  match '/500' => "errors#internal_error", via: :all

  scope "(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    root 'home#index'
    # We define here a route inside the locale that just saves the current locale in the session
    get 'omniauth/:provider' => 'omniauth#localized', as: :localized_omniauth

    devise_for :users, controllers: { confirmations: 'users/confirmations', 
                                         registrations: 'users/registrations',
                                         omniauth_callbacks: 'users/omniauth_callbacks' },
                       skip: [:omniauth_callbacks, :registrations, :confirmations]

    # override routes so it refers to correct action on validation fails
    devise_scope :user do
      get "users/sign_up" => "users/registrations#new", as: :new_user_registration
      post "users/sign_up" => "users/registrations#create", as: :user_registration
      patch "users/sign_up" => "users/registrations#update"
      put "users/sign_up" => "users/registrations#update"
      delete "users/sign_up" => "users/registrations#destroy"
      get "users/edit" => "users/registrations#edit", as: :edit_user_registration
      get "users/cancel" => "users/registrations#cancel", as: :cancel_user_registration
      get "users/confirmation/new" => "users/confirmations#new", as: :new_user_confirmation
      get "users/confirmation" => "users/confirmations#show", as: :user_confirmation
      post "users/confirmation" => "users/confirmations#create"
    end

    resources :home, only: [:index]
    get 'home/search' => 'home#search'
    get 'contact/:id' => 'home#contact', as: :contact
    get 'terms-of-service' => 'home#terms_of_service'
    get 'privacy-policy' => 'home#privacy_policy'
    get 'cookies-policy' => 'home#cookies_policy'

    resources :users, path: 'catteries', as: 'catteries', only: [:index, :show ] do
      member do 
        get 'my-cattery' => 'users#my_cattery', as: 'my-cattery'
        post 'my-cattery' => 'users#update_cattery'
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
    resources :pairs, only: [:index, :new, :create, :edit, :update, :destroy]
    resources :messages, only: [:index, :new, :create]
  end
end
