Turbolinks.setProgressBarDelay(250)

$(document).on('turbolinks:load', function() {
  // BEGIN patched select.js file
  (function($) {
    'use strict';

    let _defaults = {
      classes: '',
      dropdownOptions: {}
    };

    /**
     * @class
     *
     */
    class FormSelect extends Component {
      /**
       * Construct FormSelect instance
       * @constructor
       * @param {Element} el
       * @param {Object} options
       */
      constructor(el, options) {
        super(FormSelect, el, options);

        // Don't init if browser default version
        if (this.$el.hasClass('browser-default')) {
          return;
        }

        this.el.M_FormSelect = this;

        /**
         * Options for the select
         * @member FormSelect#options
         */
        this.options = $.extend({}, FormSelect.defaults, options);

        this.isMultiple = this.$el.prop('multiple');

        // Setup
        this.el.tabIndex = -1;
        this._keysSelected = {};
        this._valueDict = {}; // Maps key to original and generated option element.
        this._setupDropdown();

        this._setupEventHandlers();
      }

      static get defaults() {
        return _defaults;
      }

      static init(els, options) {
        return super.init(this, els, options);
      }

      /**
       * Get Instance
       */
      static getInstance(el) {
        let domElem = !!el.jquery ? el[0] : el;
        return domElem.M_FormSelect;
      }

      /**
       * Teardown component
       */
      destroy() {
        this._removeEventHandlers();
        this._removeDropdown();
        this.el.M_FormSelect = undefined;
      }

      /**
       * Setup Event Handlers
       */
      _setupEventHandlers() {
        this._handleSelectChangeBound = this._handleSelectChange.bind(this);
        this._handleOptionClickBound = this._handleOptionClick.bind(this);
        this._handleInputClickBound = this._handleInputClick.bind(this);

        $(this.dropdownOptions)
          .find('li:not(.optgroup)')
          .each((el) => {
            el.addEventListener('click', this._handleOptionClickBound);
          });
        this.el.addEventListener('change', this._handleSelectChangeBound);
        this.input.addEventListener('click', this._handleInputClickBound);
      }

      /**
       * Remove Event Handlers
       */
      _removeEventHandlers() {
        $(this.dropdownOptions)
          .find('li:not(.optgroup)')
          .each((el) => {
            el.removeEventListener('click', this._handleOptionClickBound);
          });
        this.el.removeEventListener('change', this._handleSelectChangeBound);
        this.input.removeEventListener('click', this._handleInputClickBound);
      }

      /**
       * Handle Select Change
       * @param {Event} e
       */
      _handleSelectChange(e) {
        this._setValueToInput();
      }

      /**
       * Handle Option Click
       * @param {Event} e
       */
      _handleOptionClick(e) {
        e.preventDefault();
        let optionEl = $(e.target).closest('li')[0];
        this._selectOption(optionEl);
        e.stopPropagation();
      }

      _selectOption(optionEl) {
        let key = optionEl.id;
        if (!$(optionEl).hasClass('disabled') && !$(optionEl).hasClass('optgroup') && key.length) {
          let selected = true;

          if (this.isMultiple) {
            // Deselect placeholder option if still selected.
            let placeholderOption = $(this.dropdownOptions).find('li.disabled.selected');
            if (placeholderOption.length) {
              placeholderOption.removeClass('selected');
              placeholderOption.find('input[type="checkbox"]').prop('checked', false);
              this._toggleEntryFromArray(placeholderOption[0].id);
            }
            selected = this._toggleEntryFromArray(key);
          } else {
            $(this.dropdownOptions)
              .find('li')
              .removeClass('selected');
            $(optionEl).toggleClass('selected', selected);
            this._keysSelected = {};
            this._keysSelected[optionEl.id] = true;
          }

          // Set selected on original select option
          // Only trigger if selected state changed
          let prevSelected = $(this._valueDict[key].el).prop('selected');
          if (prevSelected !== selected) {
            $(this._valueDict[key].el).prop('selected', selected);
            this.$el.trigger('change');
          }
        }

        if (!this.isMultiple) {
          this.dropdown.close();
        }
      }

      /**
       * Handle Input Click
       */
      _handleInputClick() {
        if (this.dropdown && this.dropdown.isOpen) {
          this._setValueToInput();
          this._setSelectedStates();
        }
      }

      /**
       * Setup dropdown
       */
      _setupDropdown() {
        this.wrapper = document.createElement('div');
        $(this.wrapper).addClass('select-wrapper ' + this.options.classes);
        this.$el.before($(this.wrapper));
        // Move actual select element into overflow hidden wrapper
        let $hideSelect = $('<div class="hide-select"></div>');
        $(this.wrapper).append($hideSelect);
        $hideSelect[0].appendChild(this.el);

        if (this.el.disabled) {
          this.wrapper.classList.add('disabled');
        }

        // Create dropdown
        this.$selectOptions = this.$el.children('option, optgroup');
        this.dropdownOptions = document.createElement('ul');
        this.dropdownOptions.id = `select-options-${M.guid()}`;
        $(this.dropdownOptions).addClass(
          'dropdown-content select-dropdown ' + (this.isMultiple ? 'multiple-select-dropdown' : '')
        );

        // Create dropdown structure.
        if (this.$selectOptions.length) {
          this.$selectOptions.each((el) => {
            if ($(el).is('option')) {
              // Direct descendant option.
              let optionEl;
              if (this.isMultiple) {
                optionEl = this._appendOptionWithIcon(this.$el, el, 'multiple');
              } else {
                optionEl = this._appendOptionWithIcon(this.$el, el);
              }

              this._addOptionToValueDict(el, optionEl);
            } else if ($(el).is('optgroup')) {
              // Optgroup.
              let selectOptions = $(el).children('option');
              $(this.dropdownOptions).append(
                $('<li class="optgroup"><span>' + el.getAttribute('label') + '</span></li>')[0]
              );

              selectOptions.each((el) => {
                let optionEl = this._appendOptionWithIcon(this.$el, el, 'optgroup-option');
                this._addOptionToValueDict(el, optionEl);
              });
            }
          });
        }

        $(this.wrapper).append(this.dropdownOptions);

        // Add input dropdown
        this.input = document.createElement('input');
        $(this.input).addClass('select-dropdown dropdown-trigger');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('readonly', 'true');
        this.input.setAttribute('data-target', this.dropdownOptions.id);
        if (this.el.disabled) {
          $(this.input).prop('disabled', 'true');
        }

        $(this.wrapper).prepend(this.input);
        this._setValueToInput();

        // Add caret
        let dropdownIcon = $(
          '<svg class="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        );
        $(this.wrapper).prepend(dropdownIcon[0]);

        // Initialize dropdown
        if (!this.el.disabled) {
          let dropdownOptions = $.extend({}, this.options.dropdownOptions);
          let userOnOpenEnd = dropdownOptions.onOpenEnd;

          // Add callback for centering selected option when dropdown content is scrollable
          dropdownOptions.onOpenEnd = (el) => {
            let selectedOption = $(this.dropdownOptions)
              .find('.selected')
              .first();

            if (selectedOption.length) {
              // Focus selected option in dropdown
              M.keyDown = true;
              this.dropdown.focusedIndex = selectedOption.index();
              this.dropdown._focusFocusedItem();
              M.keyDown = false;

              // Handle scrolling to selected option
              if (this.dropdown.isScrollable) {
                let scrollOffset =
                  selectedOption[0].getBoundingClientRect().top -
                  this.dropdownOptions.getBoundingClientRect().top; // scroll to selected option
                scrollOffset -= this.dropdownOptions.clientHeight / 2; // center in dropdown
                this.dropdownOptions.scrollTop = scrollOffset;
              }
            }

            // Handle user declared onOpenEnd if needed
            if (userOnOpenEnd && typeof userOnOpenEnd === 'function') {
              userOnOpenEnd.call(this.dropdown, this.el);
            }
          };

          // Prevent dropdown from closeing too early
          dropdownOptions.closeOnClick = false;

          this.dropdown = M.Dropdown.init(this.input, dropdownOptions);
        }

        // Add initial selections
        this._setSelectedStates();
      }

      /**
       * Add option to value dict
       * @param {Element} el  original option element
       * @param {Element} optionEl  generated option element
       */
      _addOptionToValueDict(el, optionEl) {
        let index = Object.keys(this._valueDict).length;
        let key = this.dropdownOptions.id + index;
        let obj = {};
        optionEl.id = key;

        obj.el = el;
        obj.optionEl = optionEl;
        this._valueDict[key] = obj;
      }

      /**
       * Remove dropdown
       */
      _removeDropdown() {
        $(this.wrapper)
          .find('.caret')
          .remove();
        $(this.input).remove();
        $(this.dropdownOptions).remove();
        $(this.wrapper).before(this.$el);
        $(this.wrapper).remove();
      }

      /**
       * Setup dropdown
       * @param {Element} select  select element
       * @param {Element} option  option element from select
       * @param {String} type
       * @return {Element}  option element added
       */
      _appendOptionWithIcon(select, option, type) {
        // Add disabled attr if disabled
        let disabledClass = option.disabled ? 'disabled ' : '';
        let optgroupClass = type === 'optgroup-option' ? 'optgroup-option ' : '';
        let multipleCheckbox = this.isMultiple
          ? `<label><input type="checkbox"${disabledClass}"/><span>${option.innerHTML}</span></label>`
          : option.innerHTML;
        let liEl = $('<li></li>');
        let spanEl = $('<span></span>');
        spanEl.html(multipleCheckbox);
        liEl.addClass(`${disabledClass} ${optgroupClass}`);
        liEl.append(spanEl);

        // add icons
        let iconUrl = option.getAttribute('data-icon');
        if (!!iconUrl) {
          let imgEl = $(`<img alt="" src="${iconUrl}">`);
          liEl.prepend(imgEl);
        }

        // Check for multiple type.
        $(this.dropdownOptions).append(liEl[0]);
        return liEl[0];
      }

      /**
       * Toggle entry from option
       * @param {String} key  Option key
       * @return {Boolean}  if entry was added or removed
       */
      _toggleEntryFromArray(key) {
        let notAdded = !this._keysSelected.hasOwnProperty(key);
        let $optionLi = $(this._valueDict[key].optionEl);

        if (notAdded) {
          this._keysSelected[key] = true;
        } else {
          delete this._keysSelected[key];
        }

        $optionLi.toggleClass('selected', notAdded);

        // Set checkbox checked value
        $optionLi.find('input[type="checkbox"]').prop('checked', notAdded);

        // use notAdded instead of true (to detect if the option is selected or not)
        $optionLi.prop('selected', notAdded);

        return notAdded;
      }

      /**
       * Set text value to input
       */
      _setValueToInput() {
        let values = [];
        let options = this.$el.find('option');

        options.each((el) => {
          if ($(el).prop('selected')) {
            let text = $(el).text();
            values.push(text);
          }
        });

        if (!values.length) {
          let firstDisabled = this.$el.find('option:disabled').eq(0);
          if (firstDisabled.length && firstDisabled[0].value === '') {
            values.push(firstDisabled.text());
          }
        }

        this.input.value = values.join(', ');
      }

      /**
       * Set selected state of dropdown to match actual select element
       */
      _setSelectedStates() {
        this._keysSelected = {};

        for (let key in this._valueDict) {
          let option = this._valueDict[key];
          let optionIsSelected = $(option.el).prop('selected');
          $(option.optionEl)
            .find('input[type="checkbox"]')
            .prop('checked', optionIsSelected);
          if (optionIsSelected) {
            this._activateOption($(this.dropdownOptions), $(option.optionEl));
            this._keysSelected[key] = true;
          } else {
            $(option.optionEl).removeClass('selected');
          }
        }
      }

      /**
       * Make option as selected and scroll to selected position
       * @param {jQuery} collection  Select options jQuery element
       * @param {Element} newOption  element of the new option
       */
      _activateOption(collection, newOption) {
        if (newOption) {
          if (!this.isMultiple) {
            collection.find('li.selected').removeClass('selected');
          }
          let option = $(newOption);
          option.addClass('selected');
        }
      }

      /**
       * Get Selected Values
       * @return {Array}  Array of selected values
       */
      getSelectedValues() {
        let selectedValues = [];
        for (let key in this._keysSelected) {
          selectedValues.push(this._valueDict[key].el.value);
        }
        return selectedValues;
      }
    }

    M.FormSelect = FormSelect;

    if (M.jQueryLoaded) {
      M.initializeJqueryWrapper(FormSelect, 'formSelect', 'M_FormSelect');
    }
  })(cash);
  //END patched select.js file


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

  // Remove touchend events on select and dropdown for iOS13


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