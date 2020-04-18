ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do

  h2 "Users" 
  columns do
    column do
      panel "# of registered users" do
        div do
          User.all.size
        end
      end
    end
    column do
      panel "# of catteries" do
        div do
          User.where(is_cattery: true).size
        end
      end
    end
    column do
      panel "# of monthly active registered users" do
        div do         
          User.where(last_sign_in_at: 1.month.ago..).size
        end
      end
    end
    column do
      panel "# of monthly active catteries" do
        div do         
          User.where(last_sign_in_at: 1.month.ago..).where(is_cattery: true).size
        end
      end
    end
  end

  h2 "Cats" 
  columns do
    column do
      panel "# of cats" do
        div do
          Cat.all.size
        end
      end
    end
    column do
      panel "# of kittens" do
        div do
          Cat.where(is_parent: false).size
        end
      end
    end
    column do
      panel "# of available kittens" do
        div do
          Cat.where(is_parent: false).where(is_available: true).size
        end
      end
    end
    column do
      panel "# of parent cats" do
        div do
          Cat.where(is_parent: true).size
        end
      end
    end
  end

    # Here is an example of a simple dashboard with columns and panels.
    #
    # columns do
    #   column do
    #     panel "Recent Posts" do
    #       ul do
    #         Post.recent(5).map do |post|
    #           li link_to(post.title, admin_post_path(post))
    #         end
    #       end
    #     end
    #   end

    #   column do
    #     panel "Info" do
    #       para "Welcome to ActiveAdmin."
    #     end
    #   end
    # end
  end # content
end
