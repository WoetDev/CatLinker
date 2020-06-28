require('imagesloaded/imagesloaded.pkgd.min')
require('colcade/colcade')

// Kitten show page masonry layout
async function masonryLayout() {
  await import ('imagesloaded/imagesloaded.pkgd.min')

  $('.grid').imagesLoaded()
  .progress(function(instance, image) {
    $('.preloader-wrapper').addClass('active');
  })
  .done(async function(instance) {
    await import ('colcade/colcade')
    $('.preloader-wrapper').removeClass('active');
    $('.grid').addClass('active');
    $('.grid').colcade({
      columns: '.grid-col',
      items: '.grid-item'
    });
    await import('materialize-css/dist/js/materialize')
    $('.materialboxed').materialbox();
  })
  .fail(function() {
    console.log('Extra images failed to load');
  });
}
masonryLayout();

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