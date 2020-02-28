Turbolinks.setProgressBarDelay(250)

$(document).on('turbolinks:load', function() {
  document.body.style.visibility = 'visible'
  // GLOBAL VARIABLES 
  var pathname = window.location.pathname;
  var querystring = window.location.search;

  // GLOBAL FUNCTIONS
  // MaterializeCSS initialization without custom code
  $('select').formSelect();
  $('.nav-dropdown-trigger').dropdown({coverTrigger: false, alignment: 'right'});
  $('.sidenav').sidenav({edge: 'right'});
  $('.tooltipped').tooltip();
  $('.tabs').tabs({swipeable: true});
  $('.materialboxed').materialbox();
  $('.datepicker').datepicker({maxDate: new Date(Date.now()), format: 'mmm dd yyyy'});
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal();

  // // Add active class to text inputs on page load
  // var textInputs = $('input[type="text"]');

  // $(textInputs).each(function() {
  //   if($(this).val() != "" && $(this).val() != null) {
  //     $(this).addClass('active');
  //   }
  //   else {
  //     $(this).removeClass('active');
  //   }
  // });

  // Close select when clicking or tapping on the first disabled option
  function closeSelectOnDisabledOption(e) {
    $(':focus').blur();    
    $('header').trigger('click');
  }

  $('.disabled').on('click', closeSelectOnDisabledOption);
  $('.disabled').on('click', function() {
    $(this).removeClass('selected');
  });

  // Add inactive class to select dropdown to grey-out input if no option is selected
  var selectInForm = $('.form select');

  function addActiveIfDropdownIsFilled() {
    if($(this).val() != "" && $(this).val() != null) {
      
      $($(this).parent().parent().find('.select-dropdown')).removeClass('inactive-select');
    }
    else {
      $($(this).parent().parent().find('.select-dropdown')).addClass('inactive-select');
    }
  }

  $(selectInForm).each(function() {
    if($(this).val() != ""  && $(this).val() != null ) {
      $($(this).parent().parent().find('.select-dropdown')).removeClass('inactive-select');
    }
    else {
      $($(this).parent().parent().find('.select-dropdown')).addClass('inactive-select');
    }
  })

  $(selectInForm).on('change', addActiveIfDropdownIsFilled);

  // Add truncation to select dropdown text inputs
  $('.dropdown-trigger').addClass('truncate');

   // Force scroll position to reset at top of the page
   $(window).scrollTop(0);

  // HOMEPAGE
  if (pathname == "/") {


    // Only initialize carousel on homepage so it doesn't interfere with changing images with tabs inside the cards
    // Adjust carousel size based on device screen width
    var cardReveals =  document.querySelectorAll('.card-reveal');

    function checkCarouselSize(){
      if ($('header').width() <= 600 )
      {
        $('.carousel').carousel({
          numVisible: 6, 
          indicators: true, 
          onCycleTo: function() {
            // Close revealed cards when cycling to a new card
            $(cardReveals).each(function() {
              $(this).attr('style', 'transform: translateY(0%);');
            });
          }
        });
      }
      else 
      {
        $('.carousel').carousel({
          numVisible: 6, 
          indicators: true, 
          shift: 150,
          onCycleTo: function() {
            $(cardReveals).each(function() {
              $(this).attr('style', 'transform: translateY(0%);');
            });
          }
        });
      }
    }

    checkCarouselSize();
    $(window).resize(checkCarouselSize);
  }

  // UPDATE CATTERY INFORMATION FORM 
  if (pathname.endsWith('my_cattery')) {  
    // Single card image preview
    var cardPicturePreview = document.querySelector('.card-picture-preview');

    function showCardPicturePreview(e) {
      var input = e.target;

      var reader = new FileReader();
      reader.onload = function(){
        image = reader.result;
        cardPicturePreview.innerHTML = '<img src="'+ image +'" />';
      };
      // Produce a data URL (base64 encoded string of the data in the file)
      // We are retrieving the first file from the FileList object
      reader.readAsDataURL(input.files[0]);
    }

    $('#user_profile_picture').on('change', showCardPicturePreview);

    // Add active class to social media icon if input is filled
    var socialMediaInputs = ['#user_facebook_link', '#user_instagram_link', '#user_twitter_link'];
    var socialMediaIcons = ['i.fa-facebook-square', '.fa-instagram', '.fa-twitter'];

    // Check if an active class should be added on page load
    for(var i = 0; i < socialMediaIcons.length;  i++) {
      if ($.trim($(socialMediaInputs[i]).val()) != '') {
        $(socialMediaIcons[i]).addClass('active-social');
      }
      else {
        $(socialMediaIcons[i]).removeClass('active-social');
      }
    }

    // Watch changes during page visit to see if active class should be added
    $(socialMediaInputs[0]).on('change', function() {
      if ($.trim($(this).val()) != '') {
        $(socialMediaIcons[0]).addClass('active-social');
      }
      else {
        $(socialMediaIcons[0]).removeClass('active-social');
      }
    });

    $(socialMediaInputs[1]).on('change', function() {
      if ($.trim($(this).val()) != '') {
        $(socialMediaIcons[1]).addClass('active-social');
      }
      else {
        $(socialMediaIcons[1]).removeClass('active-social');
      }
    });

    $(socialMediaInputs[2]).on('change', function() {
      if ($.trim($(this).val()) != '') {
        $(socialMediaIcons[2]).addClass('active-social');
      }
      else {
        $(socialMediaIcons[2]).removeClass('active-social');
      }
    });
  }

  // NEW / EDIT CAT FORM
  if (pathname == '/cats/new' || pathname.startsWith('/cats') && pathname.endsWith('/edit')) {
    // Single card image preview
    var cardPicturePreview = document.querySelector('.card-picture-preview');

    function showCardPicturePreview(e) {
      var input = e.target;

      var reader = new FileReader();
      reader.onload = function(){
        image = reader.result;
        cardPicturePreview.innerHTML = '<img src="'+ image +'" />';
      };
      // Produce a data URL (base64 encoded string of the data in the file)
      // We are retrieving the first file from the FileList object
      reader.readAsDataURL(input.files[0]);
    }

    $('#cat_card_picture').on('change', showCardPicturePreview);
  }

  // NEW / EDIT KITTEN FORM
  if (pathname == '/cats/new' && querystring.startsWith('?form=kitten') || pathname.startsWith('/cats') && pathname.endsWith('/edit') && querystring.startsWith('?form=kitten')) {
    // Multiple images previews
    var picturesPreview = document.querySelector('.pictures-preview');

    function showPicturesPreview() {
      if (window.File && window.FileList && window.FileReader) {

        var files = event.target.files; //FileList object
        picturesPreview.innerHTML = "";
        console.log(files.length);
        
        if (files.length > 0) {
          picturesPreview.innerHTML = "";
        }
        else {
          picturesPreview.innerHTML = "<span>Preview</span>";
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            //Only pics
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {;

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
            };
          }
        
      }
      else {
        console.log("Your browser does not support File API");
      }
    }

    $('#cat_pictures').on('change', showPicturesPreview);

    // Ajax - Get a new litter number
    $(document).on('ajax:before', '[data-remote]', () => {
      Turbolinks.clearCache();
    });

    var catBirthdateInput = $("#cat_birth_date");

    document.querySelector('#getNewLitterNumber').addEventListener('ajax:success', function(event) {
      var detail = event.detail;
      var data = detail[0], status = detail[1], xhr = detail[2];
      $("#cat_litter_number").parent().find('.select-dropdown').remove();
      $("#cat_litter_number").parent().html("<span class='fixed-text-ajax'><b>Litter number:&nbsp;</b> " + data + "</span>");
      $("#hidden_cat_litter_number").val(data);
      catBirthdateInput.attr('disabled', false);
    });

    // Ajax - Get birth date of selected litter
    document.querySelector('#cat_litter_number').addEventListener('change', function(event) {
      $.ajax({
        type: "GET",
        url: 'birth_date',
        data: 'litter_number=' + $(this).val(),
        success: function(data) {
          catBirthdateInput.parent().find('label').addClass('active');          
          catBirthdateInput.val('');          
          catBirthdateInput.val(new Date(data).toDateString().split(' ').slice(1).join(' '));          
          catBirthdateInput.attr('disabled', true);
        }
      });
    });

    // Enable birthdate input before submit so data isn't blocked when automatically filled in from 'AJAX - Get birth date of selected litter' function
    $(':submit').on('click', function() {
      catBirthdateInput.attr('disabled', false);
    })
  }

  // KITTEN INDEX
  if (pathname == '/cats') {
    // Trigger AJAX dropdown filters
    $('.form-filter').on('change', function() {
      Rails.fire(document.querySelector('form'), 'submit');

      // Show reset button if options are selected
      if ($(this).val() != "" && $(this).val() != null) {
        $($(this).parent().parent().find('.reset-dropdown')).show();
      }
      else {
        $($(this).parent().parent().find('.reset-dropdown')).hide();
      }

      $.ajax({
        type: 'GET',
        dataType: 'json',
        context: this, 
        url: 'cats/update_filters',
        data: {
          breeds: $('#breeds').val(),
          locations: $('#locations').val()
        },
        success: function(data){
          $('.form-filter').not(this).each(function() {
            var currentFilter = $(this).attr('id');

            // Reset the options in the select but skip the placeholder & selected options         
            var selectedOptions = $(this).parent().find('.selected');
            var retainOptionsString = 'option:first';

            for(var i = 0; i < selectedOptions.length; i++) {
              var retainOptionsString = retainOptionsString + ', option:contains("' + $(selectedOptions[i]).text() + '")';
            }

            var retainOptionsString = "'" + retainOptionsString + "'";

            $(this).children().not(retainOptionsString).remove();
            for(var i = 0; i < data[currentFilter].length; i++) {
              if (!retainOptionsString.includes(data[currentFilter][i][0])) {
                $(this).append($("<option></option>").attr("value", data[currentFilter][i][1]).text(data[currentFilter][i][0]));
              }  
            }
            
            // Reinitiliaze select
            $(this).formSelect();
            $('.disabled').on('click', closeSelectOnDisabledOption);
          });
        },
        error: function() {
          console.log('Ajax request failed');
          M.toast({html: "Oops! The filters couldn't be refreshed", classes: "alert-error"})
        }
      });

      $('#kittens').html('');
    });

    // Reset dropdown filters
    $('.reset-dropdown').on('click', function() {
      $($(this).parent().find('.form-filter')).val($(this).parent().find('.disabled').text());
      $($(this).parent().find('.select-dropdown')).val($(this).parent().find('.disabled').text());
      $($(this).parent().find('select')).children('option:not(:first)').remove();
      $(this).hide();

      $.ajax({
        type: 'GET',
        dataType: 'json',
        context: this, 
        url: 'cats/update_filters',
        data: {
          breeds: $('#breeds').val(),
          locations: $('#locations').val()
        },
        success: function(data) {
          // Fully reset the current dropdown
          var thisSelectForm = $(this).parent().find('select');
          var thisFormId = $(thisSelectForm).attr('id');

          $(thisSelectForm).children().not('option:first').remove();

          for(var i = 0; i < data[thisFormId].length; i++) {
            $(thisSelectForm).append($("<option></option>").attr("value", data[thisFormId][i][1]).text(data[thisFormId][i][0]));
          }
          
          // Reinitiliaze select
          $(thisSelectForm).formSelect();
          $('.disabled').on('click', closeSelectOnDisabledOption);

          
          // Reset the other dropdowns
          $('.form-filter').not($(this).parent().find('select')).each(function() {
            var currentFilter = $(this).attr('id');

            // Reset the options in the select but skip the placeholder & selected options
            var selectedOptions = $(this).parent().find('.selected');
            var retainOptionsString = 'option:first';

            for(var i = 0; i < selectedOptions.length; i++) {
              var retainOptionsString = retainOptionsString + ', option:contains("' + $(selectedOptions[i]).text() + '")';
            }

            var retainOptionsString = "'" + retainOptionsString + "'";

            $(this).children().not(retainOptionsString).remove();
            for(var i = 0; i < data[currentFilter].length; i++) {
              if (!retainOptionsString.includes(data[currentFilter][i][0])) {
                $(this).append($("<option></option>").attr("value", data[currentFilter][i][1]).text(data[currentFilter][i][0]));
              }  
            }
            
            // Reinitiliaze select
            $(this).formSelect();
            $('.disabled').on('click', closeSelectOnDisabledOption);
          });
        },
        error: function() {
          console.log('Ajax request failed');
          M.toast({html: "Oops! The filters couldn't be refreshed", classes: "alert-error"})
        }
      });

      $('#kittens').html('');
    });

    // 
    var loadNextPage = function(){
      // prevent multiple loading
      if ($('#next_link').data("loading")) {
        return
      }  
      var wBottom  = $(window).scrollTop() + $(window).height();
      var elBottom = $('#kittens').offset().top + $('#kittens').height();
      // Check if we're at the bottom of the page and a next link exists before we click it
      if (wBottom > elBottom && $('#next_link')[0]) {
        $('#next_link')[0].click();
        $('#next_link').data("loading", true);
      }
    };
    
    window.addEventListener('resize', loadNextPage);
    window.addEventListener('scroll', loadNextPage);
    window.addEventListener('load',   loadNextPage);
  }

  // Show page masonry layout
  $('.grid').colcade({
    columns: '.grid-col',
    items: '.grid-item'
  });
  
  
});

$(document).on('turbolinks:request-end', function() {
  console.log(event.data.xhr);
});

$(document).on('turbolinks:before-cache', function() {

});

$(document).on('turbolinks:before-render', function() {

});



  // onCycleTo properties
  //  function(ele, dragged) {
  //   console.log(ele);
  //   console.log($(ele).index()); // the slide's index
  //   console.log(dragged);
  // }

    
  // Adjust active tab (currently became unnecessary)
  // var tabs = document.querySelectorAll('.tab');

  // function changeActiveTab() {
  //   var pathname = window.location.pathname;

  //   $(tabs).each(function() {
  //     var hrefTab = $(this).find('a').attr('href');

  //     if (pathname == hrefTab) {
  //       $(this).find('a').addClass('active');
  //     }
  //     else {
  //       $(this).find('a').removeClass('active');
  //     }
  //   });
  // }
  // changeActiveTab();
  // $('.tabs').tabs();