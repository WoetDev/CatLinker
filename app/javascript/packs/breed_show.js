import * as base from '../shared/base.js'

// BREEDS SHOW PAGE
if (base.pathname.includes(base.breedsPath.concat('/'))) {

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
  async function addTruncatedText(paragraph) {
    await import ('truncatise/index')
    var textContainer = $(paragraph).closest('.paragraph-block').find('p');

    var options = {
      TruncateLength: 80,
      TruncateBy : "words",
      Strict : false,
      StripHTML : true,
      Suffix : '<div class="truncation-link more">' + base.readMore + '..</div>'
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
    $(paragraph).append('<div class="truncation-link less">'+ base.showLess +'..</div>')
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