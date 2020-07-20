import * as base from '../shared/base.js'
import { closeSelectOnDisabledOption } from '../shared/base.js'

if (base.pathname == base.catsPath) {
  var update_filters_path = base.rootPath.concat(base.locale, '/cats/update_filters');
  var cards_container_id = $('#kittens');
}

else if (base.pathname == base.catteriesPath) {
  var update_filters_path = base.rootPath.concat(base.locale, '/users/update_filters');
  var cards_container_id = $('#catteries');
}

else if (base.pathname == base.breedsPath) {
  var cards_container_id = $('#breeds');
}

if (base.pathname == base.catsPath || base.pathname == base.catteriesPath || base.pathname == base.breedsPath) {
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

  if (base.pathname == base.catsPath || base.pathname == base.catteriesPath) {
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
        M.toast({html: base.errorRefreshFilters, classes: "alert-error"})
      }
    });
  }
  

  window.active_filter = true;
  $(cards_container_id).html('');
  $('#preloader').addClass('active');
});

// Reset dropdown filters
$('.reset-dropdown').on('click', function() {
  $($(this).parent().find('.form-filter')).val($(this).parent().find('.disabled').text());
  $($(this).parent().find('.select-dropdown')).val($(this).parent().find('.disabled').text());  
  $(this).hide();

  if (base.pathname != base.breedsPath) {
    $($(this).parent().find('select')).children('option:not(:first)').remove();

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
        M.toast({html: base.errorRefreshFilters, classes: "alert-error"})
      }
    });
  }

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
    window.active_filter = false;
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