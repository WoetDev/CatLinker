Turbolinks.setProgressBarDelay(250)

$(document).on('turbolinks:load', function() {
  document.body.style.visibility = 'visible'
  // GLOBAL VARIABLES 
  var pathname = window.location.pathname;
  var querystring = window.location.search;

  // GLOBAL FUNCTIONS
  
  // Remove MaterializeCSS select for iOS13
  // Helper function to detect which OS is running
  function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }
  
  if (getOS() == 'IOS') {
    $('select:not([multiple])').addClass('browser-default');
  }

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
      // Retrieve the first file from the FileList object
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
            };
          }
        
      }
      else {
        console.log("Your browser does not support File API");
      }
    }

    $('#cat_pictures').on('change', showPicturesPreview);

    // AJAX - Get a new litter number
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

    // AJAX - Get birth date of selected litter
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

  // KITTEN & CATTERIES INDEX
  if (pathname == '/cats') {   
    // Helper function to get the query params from the URL
    function getUrlParams()
    {
        var decodedUri = decodeURIComponent(window.location.href);
        var params = [], hash;
        var hashes = decodedUri.slice(decodedUri.indexOf('?') + 1).split('&');

        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            if (hash[1]) {
              params.push(hash[1].replace('+', ' '));
            }
        }
        return params;
    }
    
    // If a search is made from the homepage, add selected breeds in filter and update location filter on page load
    function addSearchToDropdown() {
      var selectedBreeds = getUrlParams();

      if (selectedBreeds.length > 0) {
        $('#breeds option').each(function() {
          var selected = $.inArray($(this).val(), selectedBreeds);

          if (selected != -1) {
            // If the breed exists in the array built from params hash, add selected, initialize component and show reset button
            $(this).attr('selected', 'selected');
            $(this).closest('select').formSelect();
            $('.disabled').on('click', closeSelectOnDisabledOption);
            $($(this).closest('.input-field').find('.reset-dropdown')).show();
          }
        });

        var update_filters_path = '/cats/update_filters';

        $.ajax({
          type: 'GET',
          dataType: 'json',
          context: this, 
          url: update_filters_path,
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
      }
    }
    addSearchToDropdown();
  }

  if (pathname == '/cats' || pathname == '/catteries') {
    if (pathname == '/cats') {
      var update_filters_path = '/cats/update_filters';
      var cards_container_id = $('#kittens');
    }

    else if (pathname == '/catteries') {
      var update_filters_path = '/users/update_filters';
      var cards_container_id = $('#catteries');
    }
    
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
        url: update_filters_path,
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

      $(cards_container_id).html('');
      $('#preloader').addClass('active');
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
        url: update_filters_path,
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

      $(cards_container_id).html('');
      $('#preloader').addClass('active');
    });

    var loadNextPage = function(){
      // prevent multiple loading
      if ($('#next_link').data("loading")) {
        return
      }  
      var wBottom  = $(window).scrollTop() + $(window).height();
      var elBottom = $(cards_container_id).offset().top + $(cards_container_id).height();
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
  $('.grid').imagesLoaded()
    .progress(function(instance, image) {
      $('.preloader-wrapper').addClass('active');
    })
    .done(function(instance) {
      $('.preloader-wrapper').removeClass('active');
      $('.grid').addClass('active');
      $('.grid').colcade({
        columns: '.grid-col',
        items: '.grid-item'
      });
      $('.materialboxed').materialbox();
    })
    .fail(function() {
      console.log('Extra images failed to load');
    });

    if (pathname.startsWith('/catteries/') && !pathname.endsWith('my_cattery')) {
      function showActiveFilterIcon(card) {
        $(card).find('.filter-icon-container').show();
        $(card).find('.filter-icon-container').addClass('active');
        $(card).find('.add-circle').hide();
        $(card).find('.check-circle').show();
      }

      function hideActiveFilterIcon(card) {
        $(card).find('.filter-icon-container').hide();
        $(card).find('.filter-icon-container').removeClass('active');
        $(card).find('.check-circle').hide();
        $(card).find('.add-circle').show();
      }
      
      // Cards filtering event
      function cardFilteringIcon() {
        var animationTime = 100; 
        $('.card').on({
          mouseenter: function() {
            $(this).find('.filter-icon-container').fadeIn(animationTime);
          },
          mouseleave: function() {
            $(this).find('.filter-icon-container:not(.active)').fadeOut(animationTime*2);
          },
          click: function() {
            var currentSection = $(this).closest('.section');
            var selectForm = $(currentSection).find('select');
            var catId = $(this).find('.cat-id').text();
  
            if ($(this).find('.filter-icon-container').hasClass('active')) {
              hideActiveFilterIcon(this);
  
              // Remove selected options from dropdown
              $(selectForm).find("option[value='" + catId + "']").prop('selected', false)
              $(selectForm).formSelect();
              $('.disabled').on('click', closeSelectOnDisabledOption);
              $(currentSection).find('.form-filter').trigger('change');
            }
  
            else {
              showActiveFilterIcon(this);
  
              // Add selected options to dropdown
              $(selectForm).find("option[value='" + catId + "']").prop('selected', true);
              $(selectForm).formSelect();
              $('.disabled').on('click', closeSelectOnDisabledOption);
              $(currentSection).find('.form-filter').trigger('change');
            }
          }
        });
      }
      cardFilteringIcon();

      // Cattery show page filtering
      $('.form-filter').on('change', function() {
        var currentSection = $(this).closest('.section');

        // Reset the next filters
        var otherFilters = $(currentSection).nextAll().find('.form-filter');

        $(otherFilters).each(function() {
          var filterSection = $(this).closest('.section');

          // Reset the dropdown with only the placeholder value
          var placeholderText = $(filterSection).find('.disabled').text();
          $(this).val(placeholderText);
          $(filterSection).find('.select-dropdown').val(placeholderText);
          $(filterSection).find('.reset-dropdown').hide();
        });

        if ($(currentSection).find('.form-filter').val() == "" || $(currentSection).find('.form-filter').val() == null) {
          $($(currentSection).find('.form-filter')).val($(currentSection).find('.disabled').text());
          $($(currentSection).find('.select-dropdown')).val($(currentSection).find('.disabled').text());
        }

        // Submit the filter
        Rails.fire($('form')[0], 'submit');

        // Set filter icons on cards to be the same as selected options in dropdown
        $(currentSection).find('.card').each(function() {
          var catId = $(this).find('.cat-id').text();

          if ($(currentSection).find("option[value='" + catId + "']").is(':selected')) {
            showActiveFilterIcon(this);
          }

          else {
            if ($(this).find('.filter-icon-container').hasClass('active')) {
              hideActiveFilterIcon(this);
            }
          }
        });

         // Show which parents/litters are being filtered on
         var filterForms = $('.form-filter');

         var selectedFilterMessage = $(currentSection).nextAll().find('.selected-filters-message');
         $(selectedFilterMessage).html('');
 
         $(filterForms).each(function() {
           var filterSection = $(this).closest('.section');
           var selectedOptions = $(filterSection).find('option:selected');
         
           $(selectedFilterMessage).each(function() {
             $(this).show();
             var messageSection = $(this).closest('.section');
             var selectedOptionsString = '';
 
             // Create string of selected options (taking the value of .select-dropdown input directly sometimes returns placeholder)
             for(var i = 0; i < selectedOptions.length; i++) {
               var selectedOptionsString = selectedOptionsString + $(selectedOptions[i]).text();
               if (i+1 != selectedOptions.length ) {
                 var selectedOptionsString = selectedOptionsString + ', ';
               }
             }
             
             // Only add a message if the filter is used
             if (filterSection.find('.form-filter').val() != "" && filterSection.find('.form-filter').val() != null) {
               $(this).append('<i class="material-icons filter-list">filter_list</i><span>Showing ' + $(messageSection).find('h1').first().text().toLowerCase() +' from the ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + selectedOptionsString + '</b>');
             }
 
             // Add a line break if more than one filter is active
             if ($(this).html != '') {
               $(this).append('<br>');
             }
           });
         });

         // Check if values exist in other filters, in case there aren't, reset the select options messages
          var allFiltersAreEmpty = true;

          for (var i = 0; i < filterForms.length; i++) {
            var valueFilterForm = $(filterForms[i]).val();

            if (valueFilterForm != "" && valueFilterForm != null) {
              var allFiltersAreEmpty = false;
            }
          }

         if (allFiltersAreEmpty) {
          // Hide and reset the selected parents message when the filter is empty
          $(selectedFilterMessage).each(function() {
            $(this).hide();
          });
        }
        
        if ($(this).val() != "" && $(this).val() != null) {
          // Show reset button if options are selected
          $($(this).parent().parent().find('.reset-dropdown')).show();
        }

        else {
          // Hide reset button if no options are selected
          $($(this).parent().parent().find('.reset-dropdown')).hide();
        }

        // Send AJAX request to update other filters
        var ajaxUrlPath = '/catteries/' + $('#message_user_id').val() + '/show_filters';

        $.ajax({
          type: 'GET',
          dataType: 'json',
          context: this, 
          url: ajaxUrlPath,
          data: {
            parents_filter: $('#parents_filter').val()
          },
          success: function(data) {          
            // Reset the other dropdowns
            $(currentSection).nextAll().find('.form-filter').not($(this).parent().find('select')).each(function() {
              var currentFilter = $(this).attr('id');
  
              // Reset the options in the select but skip the placeholder & selected options
              var selectedOptions = $(this).parent().find('.selected');
              var retainOptionsString = 'option:first';

              if (selectedOptions) {
                for(var i = 0; i < selectedOptions.length; i++) {
                  var retainOptionsString = retainOptionsString + ', option:contains("' + $(selectedOptions[i]).text() + '")';
                }
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
      });

      // Cattery show page filter reset
      $('.reset-dropdown').on('click', function() {
        var currentSection = $(this).closest('.section');

        // Reset the filter icons on the cards
        $(currentSection).find('.card').each(function() {
          hideActiveFilterIcon(this);
        });

        // Reset the dropdown with only the placeholder value
        $($(currentSection).find('.form-filter')).val($(currentSection).find('.disabled').text());
        $($(currentSection).find('.select-dropdown')).val($(currentSection).find('.disabled').text());
        $(this).hide();

        // Reset the next filters
        var otherFilters = $(currentSection).nextAll().find('.form-filter');

        $(otherFilters).each(function() {
          var filterSection = $(this).closest('.section');

          // Reset the dropdown with only the placeholder value
          var placeholderText = $(filterSection).find('.disabled').text();
          $(this).val(placeholderText);
          $(filterSection).find('.select-dropdown').val(placeholderText);
          $(filterSection).find('.reset-dropdown').hide();
        });

        if ($(currentSection).find('.form-filter').val() == "" || $(currentSection).find('.form-filter').val() == null) {
          $($(currentSection).find('.form-filter')).val($(currentSection).find('.disabled').text());
          $($(currentSection).find('.select-dropdown')).val($(currentSection).find('.disabled').text());
        }

        // Send AJAX request to reset cats
        var filterForms = $('.form-filter');

        // Check if values exist in other filters, in case there they do, submit the form
        var allFiltersAreEmpty = true;

        for (var i = 0; i < filterForms.length; i++) {
          var valueFilterForm = $(filterForms[i]).val();

          if (valueFilterForm != "" && valueFilterForm != null) {
            var allFiltersAreEmpty = false;
          }
        }

        var selectedFilterMessage = $(currentSection).nextAll().find('.selected-filters-message');

        if (allFiltersAreEmpty) {
          // Reset active filter messages
          $(selectedFilterMessage).each(function() {
            $(this).hide();
            $(this).html('');
          });
        }

        else {
          $(selectedFilterMessage).html('');

          $(filterForms).each(function() {
            var filterSection = $(this).closest('.section');
            var selectedOptions = $(filterSection).find('option:selected');
          
            $(selectedFilterMessage).each(function() {
              $(this).show();
              var messageSection = $(this).closest('.section');
              var selectedOptionsString = '';

              // Create string of selected options (taking the value of .select-dropdown input directly sometimes returns placeholder)
              for(var i = 0; i < selectedOptions.length; i++) {
                var selectedOptionsString = selectedOptionsString + $(selectedOptions[i]).text();
                if (i+1 != selectedOptions.length ) {
                  var selectedOptionsString = selectedOptionsString + ', ';
                }
              }
              
              // Only add a message if the filter is used
              if (filterSection.find('.form-filter').val() != "" && filterSection.find('.form-filter').val() != null) {
                $(this).append('<i class="material-icons filter-list">filter_list</i><span>Showing ' + $(messageSection).find('h1').first().text().toLowerCase() +' from the ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + selectedOptionsString + '</b>');
              }

              // Add a line break if more than one filter is active
              if ($(this).html != '') {
                $(this).append('<br>');
              }
            });
          });
        }

        // Send AJAX request to reset ALL of the next filter dropdowns
        var ajaxUrlPath = '/catteries/' + $('#message_user_id').val() + '/show_filters';
        
        $.ajax({
          type: 'GET',
          dataType: 'json',
          context: this, 
          url: ajaxUrlPath,
          data: {
            parents_filter: $('#parents_filter').val()
          },
          success: function(data) {          
            // Reset the other dropdowns
            $(currentSection).nextAll().find('.form-filter').each(function() {
              var currentFilter = $(this).attr('id');
  
              // Reset the options in the select but skip the placeholder & selected options
              var selectedOptions = $(this).parent().find('.selected');
              var retainOptionsString = 'option:first';

              if (selectedOptions) {
                for(var i = 0; i < selectedOptions.length; i++) {
                  var retainOptionsString = retainOptionsString + ', option:contains("' + $(selectedOptions[i]).text() + '")';
                }
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
      });

      // Switch tabs when clicking on pair card image
      $('.card .tabs-content').on('click', function(e) {

        // Get the properties and instance of the tabs
        var card = $(this).closest('.card');
        var elem = $(card).find('.tabs');
        var instance = M.Tabs.getInstance(elem);
        var tabs = $(card).find('.tab');
        var tabIndex = instance.index;
        var totalTabs = elem.length;

        if (tabIndex == totalTabs) {
          var tabId = $(tabs[0]).find('a').attr('href');
        }

        else {
          var tabId = $(tabs[tabIndex+1]).find('a').attr('href');
        }

        // Trigger a click on one of the tabs when clicking on the image
        var selector = "a[href|='" + tabId + "']";
        $(selector)[0].click();
      });

      // Add image carousel for litters
      $('.carousel').carousel({ 
        fullWidth: true,
        indicators: true,
        noWrap: true
      });
    }

    // BREEDS INDEX
    if (pathname == '/breeds') {
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

        $('#breeds').html('');
        $('#preloader').addClass('active');
      });

      // Reset dropdown filters
      $('.reset-dropdown').on('click', function() {
        $($(this).parent().find('.form-filter')).val($(this).parent().find('.disabled').text());
        $($(this).parent().find('.select-dropdown')).val($(this).parent().find('.disabled').text());
        $(this).hide();

        $('#breeds').html('');
        $('#preloader').addClass('active');
      });
    }

    // BREEDS SHOW PAGE
    if (pathname.startsWith('/breeds/')) {

      // Truncate blocks of text on page load
      const textContainers = $('.paragraph-block');
      var paragraphs = $('.paragraph-block p');
      var originalText = [];
      
      $(textContainers).each(function() {
        originalText.push($(this).find('p').html());
      });

      $(paragraphs).each(function() {
        addTruncatedText($(this));
      });

      // Truncate text
      function addTruncatedText(paragraph) {
        var textContainer = $(paragraph).closest('.paragraph-block').find('p');

        var options = {
          TruncateLength: 80,
          TruncateBy : "words",
          Strict : false,
          StripHTML : true,
          Suffix : '<div class="truncation-link more">Read more..</div>'
        };

        var text = $(textContainer).html();
        var truncatedText = truncatise(text, options);
        $(textContainer).html(truncatedText).append('...');
      }

      // Show full text
      function removeTruncatedText(paragraph) {
        var textContainer = $(paragraph).closest('.paragraph-block');
        var fullText = $(originalText).get($(textContainers).index(textContainer))
        var paragraph = $(textContainer).find('p');
        $(paragraph).html(fullText);
        $(paragraph).append('<div class="truncation-link less">Show less..</div>')
        
      }

      // Read more..
      $('p').on('click', '.more', function() {
        var paragraph = $(this).closest('.paragraph-block').find('p');
        removeTruncatedText(paragraph);
      });

      // Show less..
      $('p').on('click', '.less', function() {
        var paragraph = $(this).closest('.paragraph-block').find('p');
        addTruncatedText(paragraph);
      });
    }

    $(document).off('touchend', 'select');
    $(document).off('touchend', '.nav-dropdown-trigger');
});