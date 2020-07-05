import {strftime} from '../lib/strftime.js';
import * as base from '../shared/base.js'


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
        if (/\.(jpe?g|png)$/i.test(file.name)) {;

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
var newLitterNumberBtn = document.querySelector('#getNewLitterNumber');
var showExistingLittersBtn = $('#showExistingLitters');

// Create a new litter
$('#getNewLitterNumber').on('click', function() {
  $(showExistingLittersBtn).css('display', 'inline-block');
  $(this).hide();
});

// Get new litter number
function showNewLitterNumber(data) {
  // Hide litter number dropdown
  $(catLitterNumberInput).parent().find('.select-dropdown').hide();
  $(catLitterNumberInput).parent().find('svg').hide();
  $(catLitterNumberInput).closest('.col').find('.helper-text-error').remove();

  // Create new litter number input
  var hiddenNewLitterNumber = document.createElement('input');
  hiddenNewLitterNumber.setAttribute('id', 'hidden_cat_litter_number');
  hiddenNewLitterNumber.setAttribute('name', 'cat[litter_number]');
  hiddenNewLitterNumber.setAttribute('type', 'hidden');
  $(hiddenNewLitterNumber).val(data);

  // Create text to show new litter number
  var newLitterNumberMessage = "<span class='fixed-text-label'><b>" + base.litterNumber + ":&nbsp;</b> " + data + "</span>"

  $(hiddenNewLitterNumber).insertAfter($('.select-wrapper'));
  $(catLitterNumberInput).parent().append(newLitterNumberMessage);      
}

if ($(newLitterNumberBtn).length) {
  newLitterNumberBtn.addEventListener('ajax:success', function(event) {
    var detail = event.detail;
    var data = detail[0], status = detail[1], xhr = detail[2];
    
    showNewLitterNumber(data);
  });

  // Show existing litters
  $(showExistingLittersBtn).on('click', function() {
    $('#getNewLitterNumber').css('display', 'inline-block');
    var existingLittersSelect = $(catLitterNumberInput).parent().find('select');
    $(existingLittersSelect).formSelect();
    if ($(existingLittersSelect).val() == ""  || $(existingLittersSelect).val() == null) {
      $(catLitterNumberInput).parent().find('.select-dropdown').addClass('inactive-select');
    }

    // Remove the new litter number from the DOM
    $('input').remove('#hidden_cat_litter_number');
    $('.fixed-text-ajax').remove();
    $(this).hide();
  });    

  // AJAX - Get birth date of selected litter
  var catBirthdateInput = $("#cat_birth_date");

  // Capture the birth date on validation fail
  if ($(catBirthdateInput).val()) {
    window.rawBirthdate = strftime('%Y-%m-%dT%H:%M:%S.000Z', new Date($(catBirthdateInput).val())); 
    catBirthdateInput.val(strftime('%d %b %Y', new Date(window.rawBirthdate)));
  }
  
  // Set the birth date to a global variable if manually chosen
  $(catBirthdateInput).on('change', function() {
    window.rawBirthdate = strftime('%Y-%m-%dT%H:%M:%S.000Z', new Date($(this).val())); 
    catBirthdateInput.val(strftime('%d %b %Y', new Date(window.rawBirthdate)));
  });
  
  $('#cat_litter_number').on('change', function(event) {
    let birth_date_url = base.rootPath +  'cats/birth_date';

    $.ajax({
      type: "GET",
      url: birth_date_url,
      data: 'litter_number=' + $(this).val(),
      success: function(data) {
        catBirthdateInput.parent().find('label').addClass('active');          
        catBirthdateInput.val('');   
        // Capture the raw birth date       
        window.rawBirthdate = data;
        catBirthdateInput.val(strftime('%d %b %Y', new Date(data)));
      }
    });
  });

  // Submit the raw birth date
  $('body').on('submit','form', function() {
    $(catBirthdateInput).val(window.rawBirthdate);
  }); 
}

