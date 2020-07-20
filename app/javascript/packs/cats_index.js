import * as base from '../shared/base.js'
import { closeSelectOnDisabledOption } from '../shared/base.js'

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
async function addSearchToDropdown() {
  await import('materialize-css/dist/js/materialize')

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

    let update_filters_path = base.rootPath.concat(base.locale, '/cats/update_filters');
    
    if (base.pathname == base.catsPath) {
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
  }
}
addSearchToDropdown();