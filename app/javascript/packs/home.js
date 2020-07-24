import * as base from '../shared/base.js'

if (base.pathname == base.rootPath || base.pathname == base.localeRootPath) {
// Only initialize carousel on homepage so it doesn't interfere with changing images with tabs inside the cards
// Adjust carousel size based on device screen width
var cardReveals =  document.querySelectorAll('.card-reveal');

async function checkCarouselSize(){
  await import('materialize-css/dist/js/materialize')

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

// Help pages
$('.video-wrapper').on('click', function () {
  let video =  $(this).find('.video')[0];
  let paused = video.paused;

  if (paused){
    video.controls = true;   
    video.play();   
    $(this).find('.play-btn').fadeOut();
  }

  else {
    video.controls = false;   
    video.pause();
    $(this).find(".play-btn").fadeIn();
  }

  return false;
});

// Show play button again when video has ended
$('.video').on('ended', function() {
  $(this)[0].controls = false;   
  $(this).parent().find(".play-btn").fadeIn();
});