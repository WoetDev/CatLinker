import * as base from '../shared/base.js'
import { closeSelectOnDisabledOption } from '../shared/base.js'
import ('objectFitPolyfill/dist/objectFitPolyfill.min')

if (base.pathname.includes(base.catteriesPath.concat('/')) && !base.pathname.endsWith('my-cattery')) {
  // Remove the inlined overflow:hidden added by the materialize card reveal
  $('.card-reveal .card-title').on('click', function() {
    var el = $(this);
    setTimeout(function() { $(el).closest('.card').addClass('overflow-visible'); }, 300);
    
  });

  $('.card-reveal-link.activator').on('click', function() {
    $(this).closest('.card').removeClass('overflow-visible');
  });

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
  var animationTime = 100; 

  // Attach events to body so event handler is added again when cards are replaced
  $('body').on('mouseenter','.card', function() {
    $(this).find('.filter-icon-container').fadeIn(animationTime);
  });

  $('body').on('mouseleave','.card', function() {
    $(this).find('.filter-icon-container:not(.active)').fadeOut(animationTime*2);
  })
  
  $('body').on('click','.card-image, .info-block', function() {
    console.log('click event fired');
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
  });

  // Cattery show page filtering
  $('.form-filter').on('change', function() {
    console.log('filter event fired');
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
           $(this).append('<i class="material-icons filter-list">filter_list</i><span>' + base.showing + ' ' + $(messageSection).find('h1').first().text().toLowerCase() +' ' + base.fromThe + ' ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + base.captilizeAllWords(selectedOptionsString) + '</b>').append('<br>');
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
    var ajaxUrlPath = '/' + base.locale + '/catteries/' + $('#message_user_id').val() + '/show_filters';

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
        M.toast({html: base.errorRefreshFilters, classes: "alert-error"})
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
            $(this).append('<i class="material-icons filter-list">filter_list</i><span>' + base.showing + ' ' + $(messageSection).find('h1').first().text().toLowerCase() +' ' + base.fromThe + ' ' + $(filterSection).find('h1').first().text().toLowerCase() + ': </span><b>' + selectedOptionsString + '</b>');
          }

          // Add a line break if more than one filter is active
          if ($(this).html != '') {
            $(this).append('<br>');
          }
        });
      });
    }

    // Send AJAX request to reset ALL of the next filter dropdowns
    var ajaxUrlPath = '/' + base.locale +'/catteries/' + $('#message_user_id').val() + '/show_filters';
    
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
}