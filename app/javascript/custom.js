// IMPORTS
import {strftime} from './lib/strftime.js';

Turbolinks.setProgressBarDelay(250)

$(document).on('turbolinks:load', function(e) {
  // IE object-fit polyfill
  objectFitPolyfill();

  // Cookies disclaimer
  // Hide cookie disclaimer on agreement
  $('.cookies-disclaimer button').on('click', function() {
    $('.cookies-disclaimer').hide();
    Cookies.set('_cookie_consent', true, { expires: 365 });
  });

  // Check if the cookie disclaimer has already been accepted
  function hideAlreadyAcceptedCookieDisclaimer() {
    var consent = Cookies.get('_cookie_consent');
    if (!consent) {
      $('.cookies-disclaimer').show();
    }
  }
  hideAlreadyAcceptedCookieDisclaimer();
  
  document.body.style.visibility = 'visible'

  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-163427368-1');

  // Force scroll position to reset at top of the page  
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  // GLOBAL VARIABLES 
  var host = window.location.host;
  var pathname = window.location.pathname;
  var querystring = window.location.search;

  if (pathname == '/') {
    var locale = 'en';
  } else {
    var locale = pathname.substring(1,3);
  }

  // TRANSLATIONS
  if (locale == 'nl') {
    var readMore = "Lees meer"
    var showLess = "Verberg"
    var litterNumber = "Nieuw nestje nummer"
    var errorRefreshFilters = "Oeps! De filters konden niet hernieuwd worden"
    var showing = "Gefilterde"
    var fromThe = "van de"

    // Datepicker
    var cancel = 'Annuleer';
    var clear =	'Herstel';
    var done =	'Ok';
    var previousMonth =	'‹';
    var nextMonth =	'›';
    var months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];     
    var monthsShort = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug','Sep', 'Okt', 'Nov','Dec'];        
    var weekdays = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];       
    var weekdaysShort = ['Zo', 'Ma', 'Di','Wo','Do','Vr','Za'];           
    var weekdaysAbbrev = ['ZO','MA','DI','WO','DO','VR','ZA'];
  }

  else {
    var readMore = "Read more"
    var showLess = "Show less"
    var litterNumber = "New litter number"
    var errorRefreshFilters = "Oops! The filters couldn't be refreshed"
    var showing = "Showing"
    var fromThe = "from the"

    // Datepicker
    var cancel = 'Cancel';
    var clear =	'Clear';
    var done =	'Ok';
    var previousMonth =	'‹';
    var nextMonth =	'›';
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];     
    var monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];        
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];       
    var weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];           
    var weekdaysAbbrev = ['S','M','T','W','T','F','S'];
  }

  // PATHS
  var rootPath = '/';
  var localeRootPath = rootPath.concat(locale);
  var catsPath = rootPath.concat(locale, '/cats');
  var newCatPath = rootPath.concat(locale, '/cats/new');
  var catteriesPath = rootPath.concat(locale, '/catteries');
  var breedsPath = rootPath.concat(locale, '/breeds');

  // GLOBAL FUNCTIONS
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

  // Helper function to detect which browser is running
  function getBrowser() { 
    var browser = null;

    if((navigator.userAgent.indexOf('OPR')) != -1 ){
      browser = "Opera";
    }
    else if(navigator.userAgent.indexOf("Edge") != -1 ){
      browser = "Edge";
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 ){
      browser = "Chrome";
    }
    else if(navigator.userAgent.indexOf("Safari") != -1){
      browser = "Safari";
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ){
      browser = "Firefox";
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
      browser = "IE";
    }  
    else {
      browser = "Unknown";
    }
    return browser;
  }

  // iOS13: set MaterializeCSS select to browser default
  if (getOS() == 'iOS') {
    $('select:not([multiple])').addClass('browser-default');

    $('select:not([multiple])').each(function() {
      if($(this).val() != "" && $(this).val() != null) {
        $(this).removeClass('inactive-select');
      }
      else {
        $(this).addClass('inactive-select');
      }
    });
    
    $('select:not([multiple])').on('change', addDefaultActiveIfDropdownIsFilled);
  
    function addDefaultActiveIfDropdownIsFilled() {
      if($(this).val() != "" && $(this).val() != null) {
        $(this).removeClass('inactive-select');
      }
      else {
        $(this).addClass('inactive-select');
      }
    }
  }

  // Internet Explorer: move hidden input for checkboxes and switches
  if (getBrowser() == 'IE') {
    var hiddenInputs = $('input[type=checkbox]').closest('.input-field').find('input[type=hidden');
    $(hiddenInputs).each(function() {
      var inputField = $(this).closest('.input-field');
      $(inputField).prepend(this);
    });

    $('.tabs-content').css('height', '300px');
  }
  
  // Internet Explorer: polyfills
  if (getBrowser() == 'IE') {
    // polyfill endswith
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
      };
    }

    // polyfill includes
    if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
        'use strict';
    
        if (search instanceof RegExp) {
          throw TypeError('first argument must not be a RegExp');
        } 
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
      };
    }

    // polyfill replace to work with SVGs
    if (!Object.getOwnPropertyDescriptor(Element.prototype,'classList')){
      if (HTMLElement&&Object.getOwnPropertyDescriptor(HTMLElement.prototype,'classList')){
          Object.defineProperty(Element.prototype,'classList',Object.getOwnPropertyDescriptor(HTMLElement.prototype,'classList'));
      }
    }
  }

  // Import the Facebook Javascript SDK
  function updateStatusCallback(){
    if (response.status === 'connected') {
      // The user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid access token, a signed
      // request, and the time the access token 
      // and signed request each expire.
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      console.log('facebook is connected: logged in and app is authenticated');
      console.log('iud: ' + uid);
      console.log('accessToken: ' + accessToken);
    } 
    else if (response.status === 'not_authorized') {
      // The user hasn't authorized your application.  They
      // must click the Login button, or you must call FB.login
      // in response to a user gesture, to launch a login dialog.
      console.log('facebook is connected: logged in and app is authenticated');
    } 
    else {
      // The user isn't logged in to Facebook. You can launch a
      // login dialog with a user gesture, but the user may have
      // to log in to Facebook before authorizing your application.
      console.log('facebook is connected: logged in and app is authenticated');
    }
  }

  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '613634386154840',
      version: 'v2.7'
    });     
    // $('#loginbutton,#feedbutton').removeAttr('disabled');
    // FB.getLoginStatus(updateStatusCallback);
  });

  $('#facebookShareBtn').on('click', function() {
    if (host.includes('localhost')) {
      var fbShareLink = 'http://www.catlinker.com';
    }
    else {
      var fbShareLink = window.location.href;
    }
    
    FB.ui({
      display: 'popup',
      method: 'share',
      href: fbShareLink,
    }, function(response){});
  });

  // Import the Twitter Javascript API
  window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
  
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
  
    return t;
  }(document, "script", "twitter-wjs"));

  // MaterializeCSS initialization
  $('select').formSelect();
  $('.nav-dropdown-trigger').dropdown({coverTrigger: false, alignment: 'right'});
  $('.sidenav').sidenav({edge: 'right'});
  $('.tooltipped').tooltip();
  $('.tabs').tabs({swipeable: true});
  $('.materialboxed').materialbox();
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal();

  // Set the datepicker with i18n options
  $('.datepicker').datepicker({ 
    maxDate: new Date(Date.now()), 
    format: 'dd mmm yyyy',
    i18n: {
      cancel:	cancel,
      clear:	clear,
      done:	done,
      previousMonth:	previousMonth,
      nextMonth: nextMonth,
      months:	months,         
      monthsShort: monthsShort,
      weekdays: weekdays,              
      weekdaysShort: weekdaysShort,                
      weekdaysAbbrev:	weekdaysAbbrev
    }
  });

  // GLOBAL FUNCTIONS FOR FORMS

  // Capitalize the first letter
  $('.capitalize-input').on('change', function() {
    $(this).val(function( i, val ) {
      return val.charAt(0).toUpperCase() + val.slice(1);;
    });
  })

  // Titlecase helper
  const captilizeAllWords = (sentence) => {
    if (typeof sentence !== "string") return sentence;
    return sentence.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Capitalize the first letter in every word for titlecase inputs
  $('.titlecase-input').on('change', function() {
    $(this).val(function( i, val ) {
      return captilizeAllWords(val);
    });
  })

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
    if ($(this).val() != "" && $(this).val() != null) {
      $($(this).parent().parent().find('.select-dropdown')).removeClass('inactive-select');
    }
    else {
      $($(this).parent().parent().find('.select-dropdown')).addClass('inactive-select');
    }
  }

  $(selectInForm).each(function() {
    if ($(this).val() != ""  && $(this).val() != null) {
      $($(this).parent().parent().find('.select-dropdown')).removeClass('inactive-select');
    }
    else {
      $($(this).parent().parent().find('.select-dropdown')).addClass('inactive-select');
    }
  })

  $(selectInForm).on('change', addActiveIfDropdownIsFilled);

  // Add active class to labels if its input is filled
  // Attach event to body so event handler is re-attached when form is being submitted through ajax
  $('body').on('submit','form', function() {

    // Run event until we're sure all fields have been checked
    var timer = setInterval(checkActiveFields, 250);

    function checkActiveFields() {
      $('.input-field').each(function() {
        if ($(this).find(':input').val() != ""  && $(this).find(':input').val() != null) {
          $(this).find('label').addClass('active');
        }
      }); 
      clearInterval(timer);
    }
  });
  
  // Add truncation to select dropdown text inputs
  $('.dropdown-trigger').addClass('truncate');

  // HOMEPAGE
  if (pathname == rootPath || pathname == localeRootPath) {

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
  if (pathname.endsWith('my-cattery')) {  
    // Single card image preview
    var cardPicturePreview = document.querySelector('.card-picture-preview');

    function showCardPicturePreview(e) {
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
  }

  // NEW / EDIT CAT FORM
  // Single card image preview
  var cardPicturePreview = document.querySelector('.card-picture-preview');

  function showCardPicturePreview(e) {
    $('#hidden_cat_card_picture').remove();

    var input = e.target;

    var reader = new FileReader();
    reader.onload = function(){
      var image = reader.result;
      cardPicturePreview.innerHTML = '<img src="'+ image +'" data-object-fit="cover" />';
    };
    // Produce a data URL (base64 encoded string of the data in the file)
    // We are retrieving the first file from the FileList object
    reader.readAsDataURL(input.files[0]);
    
    reader.onloadend = function () {
      objectFitPolyfill();
    };
  }

  if (querystring.includes('?form=kitten') || querystring.includes('?form=parent')) {
    $('#cat_card_picture').on('change', showCardPicturePreview);
  }

  // NEW / EDIT KITTEN FORM
  // AJAX - Get a new litter number
  if (querystring.includes('?form=kitten')) {

    // Multiple images previews
    var picturesPreview = document.querySelector('.pictures-preview');

    function showPicturesPreview() {
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
    $('#cat_pictures').on('change', function() {
      console.log("value other pictures changed.")
    });
 
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
      var newLitterNumberMessage = "<span class='fixed-text-ajax'><b>" + litterNumber + ":&nbsp;</b> " + data + "</span>"

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
      
      document.querySelector('#cat_litter_number').addEventListener('change', function(event) {
        // Build different ajax url based in case validation failed
        if (pathname.includes('new')) {
          var birth_date_url = 'birth_date';
        }
        else {
          var birth_date_url = 'cats/birth_date';
        }

        $.ajax({
          type: "GET",
          url: birth_date_url,
          data: 'litter_number=' + $(this).val(),
          success: function(data) {
            catBirthdateInput.parent().find('label').addClass('active');          
            catBirthdateInput.val('');          
            // catBirthdateInput.val(new Date(data).toDateString().split(' ').slice(1).join(' '));          
            catBirthdateInput.val(strftime('%d %b %Y', new Date(data)));
          }
        });
      });
    }
  }

  // KITTEN & CATTERIES INDEX
  if (pathname == catsPath) {   
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

        var update_filters_path = rootPath.concat(locale, '/cats/update_filters');

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
            M.toast({html: errorRefreshFilters, classes: "alert-error"})
          }
        });
      }
    }
    addSearchToDropdown();
  }

  if (pathname == catsPath || pathname == catteriesPath) {
    if (pathname == catsPath) {
      var update_filters_path = rootPath.concat(locale, '/cats/update_filters');
      var cards_container_id = $('#kittens');
    }

    else if (pathname == catteriesPath) {
      var update_filters_path = rootPath.concat(locale, '/users/update_filters');
      var cards_container_id = $('#catteries');
    }
    
    // Trigger AJAX dropdown filters
    $('.form-filter').on('change', function() {
      // Always set the value of the hidden input for the select to blank, otherwise Firefox sometimes adds a string inside of it incorrectly

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
          M.toast({html: errorRefreshFilters, classes: "alert-error"})
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
          M.toast({html: errorRefreshFilters, classes: "alert-error"})
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
      if ($('#next_link')[0]) {
        $('footer').hide();
        var elBottom = $(cards_container_id).offset().top + $(cards_container_id).height();
        var wBottom  = $(window).scrollTop() + $(window).height();
      }

      // Check if we're at the bottom of the page and a next link exists before we click it
      if (wBottom > elBottom-150 && $('#next_link')[0]) {
        $('#next_link')[0].click();
        $('#next_link').data("loading", true);
        $('#preloader').addClass('active');
      }
      else {
        $('footer').show();
      }
    };
    
    window.addEventListener('resize', loadNextPage);
    window.addEventListener('scroll', loadNextPage);
    window.addEventListener('load',   loadNextPage);
  }

  // Kitten show page masonry layout
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

    // Color kitten show page chips and availability message
    function checkDataSuccess(chip) {
      if ($(chip).find('.material-icons').hasClass('check')) {
        $(chip).addClass('success');
      }
      else {
        $(chip).addClass('fail');
      }
    }
    
    $('.chip').each(function() {
      checkDataSuccess($(this))
    });

    checkDataSuccess($('.available-message'));
    

    if (pathname.includes(catteriesPath.concat('/')) && !pathname.endsWith('my-cattery')) {
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
          }
        });

        $('.card-image, .info-block').on({
          click: function(e) {
            var currentSection = $(this).closest('.section');
            var card = $(this).closest('.card');
            var selectForm = $(currentSection).find('select');
            var catId = $(card).find('.cat-id').text();
  
            if ($(card).find('.filter-icon-container').hasClass('active')) {
              hideActiveFilterIcon(card);
  
              // Remove selected options from dropdown
              $(selectForm).find("option[value='" + catId + "']").prop('selected', false)
              $(selectForm).formSelect();
              $('.disabled').on('click', closeSelectOnDisabledOption);
              $(currentSection).find('.form-filter').trigger('change');
            }
  
            else {
              showActiveFilterIcon(card);
  
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
               $(this).append('<i class="material-icons filter-list">filter_list</i><span>' + showing + ' ' + $(messageSection).find('h1').first().text().toLowerCase() +' ' + fromThe + ' ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + captilizeAllWords(selectedOptionsString) + '</b>').append('<br>');
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
        var ajaxUrlPath = '/' + locale + '/catteries/' + $('#message_user_id').val() + '/show_filters';

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
            M.toast({html: errorRefreshFilters, classes: "alert-error"})
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
                $(this).append('<i class="material-icons filter-list">filter_list</i><span>' + showing + ' ' + $(messageSection).find('h1').first().text().toLowerCase() +' ' + fromThe + ' ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + selectedOptionsString + '</b>');
              }

              // Add a line break if more than one filter is active
              if ($(this).html != '') {
                $(this).append('<br>');
              }
            });
          });
        }

        // Send AJAX request to reset ALL of the next filter dropdowns
        var ajaxUrlPath = '/' + locale +'/catteries/' + $('#message_user_id').val() + '/show_filters';
        
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
            M.toast({html: errorRefreshFilters, classes: "alert-error"})
          }
        });
      });

      // Switch tabs when clicking on pair card image
      if ($('.tabs').length > 0) {
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
      }

      // Add image carousel for litters
      $('.carousel').carousel({ 
        fullWidth: true,
        indicators: true,
        noWrap: true
      });
    }

    // BREEDS INDEX
    if (pathname == breedsPath) {
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

        $('#preloader').addClass('active');
      });

      document.querySelector('form').addEventListener('ajax:send', function() {
        $('#breeds').html('');
      });

      // Reset dropdown filters
      $('.reset-dropdown').on('click', function() {
        $($(this).parent().find('.form-filter')).val($(this).parent().find('.disabled').text());
        $($(this).parent().find('.select-dropdown')).val($(this).parent().find('.disabled').text());
        $(this).hide();

        $('#breeds').html('');
        $('#preloader').addClass('active');
      });

      var cards_container_id = '#breeds';

      var loadNextPage = function(){
        // prevent multiple loading
        if ($('#next_link').data("loading")) {
          return
        }  
        if ($('#next_link')[0]) {
          $('footer').hide();
          var elBottom = $(cards_container_id).offset().top + $(cards_container_id).height();
          var wBottom  = $(window).scrollTop() + $(window).height();
        }
  
        // Check if we're at the bottom of the page and a next link exists before we click it
        if (wBottom > elBottom-150 && $('#next_link')[0]) {
          $('#next_link')[0].click();
          $('#next_link').data("loading", true);
          $('#preloader').addClass('active');
        }
        else {
          $('footer').show();
        }
      };
      
      window.addEventListener('resize', loadNextPage);
      window.addEventListener('scroll', loadNextPage);
      window.addEventListener('load',   loadNextPage);
    }

    // BREEDS SHOW PAGE
    if (pathname.includes(breedsPath.concat('/'))) {

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
          Suffix : '<div class="truncation-link more">' + readMore + '..</div>'
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
        $(paragraph).append('<div class="truncation-link less">'+ showLess +'..</div>')
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
});