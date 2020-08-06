var strftime = require('strftime/strftime-min')
import * as base from '../shared/base.js'



$('#cat_card_picture').on('change', function() {
  console.log($(this).val());
});

// Multiple images previews
var picturesPreview = document.querySelector('.pictures-preview');

async function showPicturesPreview(event) {
  await import('objectFitPolyfill/dist/objectFitPolyfill.min')

  if (window.File && window.FileList && window.FileReader) {
    $('[id^="hidden_cat_card_picture_"]').each(function() {
      $(this).remove();
    });

    var files = event.target.files; //FileList object
    picturesPreview.innerHTML = "";
    
    if (files.length > 0) {
      picturesPreview.innerHTML = "";
    }
    else {
      picturesPreview.innerHTML = "<span>Preview</span>";
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        //Only pics
        if (/\.(jfif|jpe?g|png)$/i.test(file.name)) {;

        var reader = new FileReader();
        reader.addEventListener("load", function (event) {
            var picFile = event.target;
            var div = document.createElement("div");
            div.className = "image-placeholder";
            var img = "<img class='thumbnail materialboxed' src='" + picFile.result + "'/>"
            div.innerHTML = img;
            picturesPreview.insertBefore(div, null);
        });
        // Read the image
        reader.readAsDataURL(file);
        }

        reader.onloadend = function () {
          $('.materialboxed').materialbox();
          objectFitPolyfill();
        };
      }
    
  }
  else {
    console.log("Your browser does not support File API");
  }
}

$('#cat_pictures').on('change', showPicturesPreview);

var catLitterNumberInput = $("#cat_litter_number");
var newLitterNumberBtn = $('#getNewLitterNumber');
var showExistingLittersBtn = $('#showExistingLitters');

if ($(newLitterNumberBtn).length > 0) {
  // Create a new litter
  $(newLitterNumberBtn).on('click', function() {
    sessionStorage.setItem('new_litter', 'true');
    $(showExistingLittersBtn).css('display', 'inline-block');
    $(this).hide();

    let new_litter_number_url = base.rootPath +  'cats/new_litter';

    $.ajax({
      type: "GET",
      url: new_litter_number_url,
      success: function(data) {
        // Hide litter number dropdown
        let litterNumberSection =  $(catLitterNumberInput).closest('.input-field');
        $(litterNumberSection).find('.select-dropdown').hide();
        $(litterNumberSection).find('select').hide();
        $(litterNumberSection).find('svg').hide();
        $(litterNumberSection).closest('.col').find('.helper-text-error').remove();

        // Create new litter number input
        let hiddenNewLitterNumber = '<input id="hidden_cat_litter_number" name="cat[litter_number]" type="hidden" value="' + data + '"></input>';

        // Create text to show new litter number
        let newLitterNumberMessage = "<span class='fixed-text-label'><b>" + base.litterNumber + ": </b> " + data + "</span>"

        $(hiddenNewLitterNumber).appendTo($(catLitterNumberInput).parent());
        $(newLitterNumberMessage).appendTo($(catLitterNumberInput).parent());
      }
    });
  });

  // Check if new litter is activated
  let newLitter = sessionStorage.getItem('new_litter');

  if (newLitter == 'true') {
    $(newLitterNumberBtn).trigger('click');
  }

  // Show existing litters
  $(showExistingLittersBtn).on('click', function() {
    sessionStorage.setItem('new_litter', 'false');
    $('#getNewLitterNumber').show();
    var existingLittersSelect = $(catLitterNumberInput).parent().find('select');
    $(existingLittersSelect).formSelect();
    if ($(existingLittersSelect).val() == ""  || $(existingLittersSelect).val() == null) {
      $(catLitterNumberInput).parent().find('.select-dropdown').addClass('inactive-select');
    }

    // Remove the new litter number from the DOM
    $('#hidden_cat_litter_number').remove();
    $('.fixed-text-label').remove();
    $(this).hide();
  });    

  // AJAX - Get birth date of selected litter
  let litterInfoInputs = ['cat_birth_date', 'cat_pair_id', 'cat_breed_id']
  
  $('#cat_litter_number').on('change', function(event) {
    let litter_info_url = base.rootPath +  'cats/litter_info';

    $.ajax({
      type: "GET",
      url: litter_info_url,
      data: 'litter_number=' + $(this).val(),
      success: function(data) {
        $("#"+litterInfoInputs[0]).parent().find('label').addClass('active');
        $("#"+litterInfoInputs[0]).val(strftime('%d %b %Y', new Date(data.cat_birth_date)));
        $("#"+litterInfoInputs[1]).val(data.cat_pair_id).formSelect();
        $("#"+litterInfoInputs[2]).val(data.cat_breed_id).formSelect();
      }
    });
  });
}
else {
  sessionStorage.setItem('new_litter', 'false');
}

