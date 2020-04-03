module MetaTagsHelper
  def meta_site_name
    content_for?(:meta_site_name) ? content_for(:meta_site_name) : DEFAULT_META["meta_site_name"]
  end

  def meta_title
    content_for?(:meta_title) ? content_for(:meta_title) : DEFAULT_META["meta_title"]
  end

  def meta_description
    content_for?(:meta_description) ? content_for(:meta_description) : t("meta.#{DEFAULT_META["meta_description"]}")
  end

  def meta_facebook_image
    meta_image = (content_for?(:meta_facebook_image) ? content_for(:meta_facebook_image) : DEFAULT_META["meta_facebook_image"])
    # little twist to make it work equally with an asset or a url
    meta_image.starts_with?("http") ? meta_image : image_url(meta_image)
  end

  def meta_twitter_image
    meta_image = (content_for?(:meta_twitter_image) ? content_for(:meta_twitter_image) : DEFAULT_META["meta_twitter_image"])
    # little twist to make it work equally with an asset or a url
    meta_image.starts_with?("http") ? meta_image : image_url(meta_image)
  end

  def meta_image_alt
    content_for?(:meta_image_alt) ? content_for(:meta_image_alt) : DEFAULT_META["meta_image_alt"]
  end
end