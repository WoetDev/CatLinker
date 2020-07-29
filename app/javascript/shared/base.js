require("turbolinks").start()
window.Cookies = require('js-cookie/src/js.cookie')

Turbolinks.setProgressBarDelay(250)

// IE object-fit polyfill
async function objectFitPolyfillLoad() {
  await import('objectFitPolyfill/dist/objectFitPolyfill.min')
  objectFitPolyfill();
}
objectFitPolyfillLoad();

// Cookies disclaimer
// Hide cookie disclaimer on agreement
async function setCookieDisclaimerCookie() {
  await import('js-cookie/src/js.cookie')

  Cookies.set('_cookie_consent', true, { expires: 365, sameSite: 'strict' });
}

$('.cookies-disclaimer button').on('click', function() {
  $('.cookies-disclaimer').hide();
  setCookieDisclaimerCookie();
});

// Check if the cookie disclaimer has already been accepted
async function hideAlreadyAcceptedCookieDisclaimer() {
  await import('js-cookie/src/js.cookie')

  var consent = Cookies.get('_cookie_consent');
  if (!consent) {
    $('.cookies-disclaimer').show();
  }
}
hideAlreadyAcceptedCookieDisclaimer();

// Force scroll position to reset at top of the page  
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// GLOBAL VARIABLES 
export let host = window.location.host;
export let pathname = window.location.pathname;
export let querystring = window.location.search;

if (pathname == '/') {
  var locale = 'en';
} else {
  var locale = pathname.substring(1,3);
}

export var locale;

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
  var showing = "Filtered"
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

export var readMore
export var showLess
export var litterNumber
export var errorRefreshFilters
export var showing
export var fromThe

export var cancel
export var clear
export var done
export var previousMonth
export var nextMonth
export var months
export var monthsShort
export var weekdays
export var weekdaysShort
export var weekdaysAbbrev

// PATHS
export var rootPath = '/';
export var localeRootPath = rootPath.concat(locale);
export var catsPath = rootPath.concat(locale, '/cats');
export var newCatPath = rootPath.concat(locale, '/cats/new');
export var catteriesPath = rootPath.concat(locale, '/catteries');
export var breedsPath = rootPath.concat(locale, '/breeds');

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
  else if(navigator.userAgent.indexOf("Edg") != -1 ){
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
if (getOS() == 'iOS' || getOS() == 'Android') {
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

// Close select when clicking or tapping on the first disabled option
export function closeSelectOnDisabledOption(e) {
  $(':focus').blur();    
  $('header').trigger('click');
}

// MaterializeCSS initialization
window.materializeLoaded = false;

async function materializeInit() {
  await import('materialize-css/dist/js/materialize')
  window.materializeLoaded = true;

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
    format: 'dd mmm yyyy ',
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
}
materializeInit();

// GLOBAL FUNCTIONS FOR FORMS

// Capitalize the first letter
$('.capitalize-input').on('change', function() {
  $(this).val(function( i, val ) {
    return val.charAt(0).toUpperCase() + val.slice(1);;
  });
})

// Titlecase helper
export const captilizeAllWords = (sentence) => {
  if (typeof sentence !== 'string') return sentence;
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

// Add active class to labels if its input is filled
// Attach event to body so event handler is re-attached when form is being submitted through ajax
$('body').on('submit','form', function() {

  // Run event until we're sure all fields have been checked
  var timer = setInterval(checkActiveFields, 250);

  function checkActiveFields() {
    $('.input-field').each(function() {
      if ($(this).find(':input').val() != ""  && $(this).find(':input').val() != null) {
        $(this).find('label').addClass('active');
        if ($('textarea').length > 0) {
          M.textareaAutoResize($(this).find('textarea'));
        }
      }
    }); 
    clearInterval(timer);
  }
});

// Replace the submit form button with a loading icon on click
$('body').on('submit', '.form', function() {
  let submitBtn = $(this).find(':submit').not('.disabled');
  let preloader = '<div class="preloader-wrapper small active" id="preloader"><div class="spinner-layer spinner-teal-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

  $(submitBtn).hide();
  if($('.form .preloader-wrapper').length < 1) {
    $(preloader).insertAfter(submitBtn);
  }
});

// Re-attach resize event to textareas on validation fail with a form that submitted through ajax
if ($('textarea')) {
  $('body').on('change','textarea', function() {
    M.textareaAutoResize($(this));
  });
}