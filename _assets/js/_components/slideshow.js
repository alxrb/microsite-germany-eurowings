///////////////////////////////////////
//      open slideshow modal
///////////////////////////////////////

// global variable for the slide content refresh interval. Needed to stop interval when slideshow is closed
var checkSlideContent;

$('.js-open-slideshow').on('click', function(e) {
  e.preventDefault();
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('slideshow-disable-scroll');
  runSlideshow();
  $('.slideshow__wrap').removeClass('is-closed').addClass('is-open');
})

function slideshowClose(e){
  e.preventDefault();
  // enable scrolling on background content
  $('body').removeClass('slideshow-disable-scroll');
  $('.slideshow__wrap').removeClass('is-open').addClass('is-closed');
  clearInterval(checkSlideContent);
}

$('.js-close-slideshow').click(function(){ slideshowClose(event); });

// closes modal on escape key press
$(document).keyup(function(event) {
  if (event.keyCode == 27) {
    slideshowClose(event);
  }
});


///////////////////////////////////////
//  Home Image slider - extra fucntions
///////////////////////////////////////

function runSlideshow() {

  var homeCarousel     = $('#slideshow');
  var transitionSpeed  = 250;
  var slideSpeed       = 3000;
  var carouselLink     = $('.js-slideshow-link');
  var carouselLocation = $('.js-slideshow-location');
  var activeSlide      = $('.owl-item.active > .slider__content');
  var hiddenElements   = '.slider__info, .owl-nav, .owl-dots';

  homeCarousel.owlCarousel({
    items:1,
    loop:true,
    autoHeight:true,
    dotsContainer: ".dots-container",
    nav: true,
    navElement: "div",
    navSpeed: (transitionSpeed + 500),
    smartSpeed: (transitionSpeed + 500),
    dragEndSpeed: transitionSpeed,
    callbacks:true
  });

  // This grabs the slide information from the data attributes to update the link
  // and location name for each slide.
  function sliderContentRefresh(){
    var slideLink       = $('.owl-item.active > .slideshow__item').data('link');
    var slideLocation   = $('.owl-item.active > .slideshow__item').data('location');
    var currentLink     = $(carouselLink).attr('href');
    var currentLocation = $(carouselLocation).text();
    // is the content already correct?
    if (currentLink !== slideLink && currentLocation !== slideLocation) {
      // change the content to the correct content
      carouselLink.attr('href', slideLink);
      carouselLocation.text(slideLocation);
    }
  }

  // the callbacks for the owlCarousel plugin are a bit crap and dont fire after
  // the animation. Also if you do two drags in a row, it is very easy to break.
  // This interval fires every half second to check the active class. I know its
  // gross, but its the most reliable way to write this code. And its a small
  // amount of processing every half second.
  checkSlideContent = setInterval(function() {
    sliderContentRefresh();
  }, 500);

  // starts to automatically cycle through slides
  // owlCarousel autoplay start stop events dont work. This is an alternate way
  // to make it auto advance and then stop when the user interacts with it
  var fauxAutoplay = setInterval(function() {
    homeCarousel.trigger('next.owl.carousel');
  }, (slideSpeed));
  homeCarousel.on('click',function() {
    clearInterval(fauxAutoplay);
  });

  // keyboard nav for the active carousel
  $(document.documentElement).keyup(function (event) {
    if (event.keyCode == 37) {  // left key press
      homeCarousel.trigger('prev.owl.carousel');
      clearInterval(fauxAutoplay);
    } else if (event.keyCode == 39) {  // right key press
      homeCarousel.trigger('next.owl.carousel');
      clearInterval(fauxAutoplay);
    }
  });

  // stop carousel autoplaying, if dragged
  homeCarousel.on('dragged.owl.carousel', function(event) {
    clearInterval(fauxAutoplay);
  });

  // stop carousel autoplaying, if dots are clicked
  $('.owl-dot').on('click', function(event) {
    clearInterval(fauxAutoplay);
  });

}