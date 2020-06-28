// Single card image preview
var cardPicturePreview = document.querySelector('.card-picture-preview');

async function showCardPicturePreview(e) {
  await import('objectFitPolyfill/dist/objectFitPolyfill.min')
  
  var input = e.target;

  var reader = new FileReader();
  reader.onload = function(){
    var image = reader.result;
    cardPicturePreview.innerHTML = '<img src="'+ image +'" data-object-fit="cover" />';
  };
  // Produce a data URL (base64 encoded string of the data in the file)
  // Retrieve the first file from the FileList object
  reader.readAsDataURL(input.files[0]);

  reader.onloadend = function () {
    objectFitPolyfill();
  };
}

$('#user_profile_picture').on('change', showCardPicturePreview);
$('#cat_card_picture').on('change', showCardPicturePreview);

// Add active class to social media icon if input is filled
var socialMediaLinks = $('#user_facebook_link, #user_instagram_link, #user_twitter_link');

// Check if an active class should be added on page load
// Fire this function until the FontAwesome SVGs have loaded
var timer = setInterval(colorFilledSocialMediaLinks, 250);

function colorFilledSocialMediaLinks() {
  $(socialMediaLinks).each(function() {
    checkIfSocialMediaLinkIsEmpty(this);
  });

  if ($('.fontawesome-i2svg-complete')) {
    clearInterval(timer);
    return;
  }
}


function checkIfSocialMediaLinkIsEmpty(link) {
  if ($(link).val() != '' && $(link).val() != null) {
    $(link).closest('.input-field').find("[class*='fa-']").addClass('active-social');
  }
  else {
    $(link).closest('.input-field').find("[class*='fa-']").removeClass('active');
    $(link).closest('.input-field').find("[class*='fa-']").removeClass('active-social');
  }
}

// Watch changes during page visit to see if active class should be added
$(socialMediaLinks).on('change', function() {
  checkIfSocialMediaLinkIsEmpty(this);
});