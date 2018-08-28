// general js for the project that wouldn't be a reuseable component

$('.js-image-gallery').each(function() {

  // add class for element styles
  $(this).addClass('image-gallery');

  // get all of the images
  var galleryImages     = $(this).children();
  var galleryImagePaths = [];
  // add each image path to an array
  for (var i = 0; i < galleryImages.length; i++) {
    galleryImagePaths.push($(galleryImages[i]).attr('src'));
  }

  var currentImageIndex = 0;
  var currentImageClass = 'image-gallery__current';
  var nextImageIndex    = 1;
  var nextImageClass    = 'image-gallery__next';

  $(galleryImages[currentImageIndex]).addClass(currentImageClass);
  $(galleryImages[nextImageIndex]).addClass(nextImageClass);

  setInterval(function() {
    // remove the current classes
    $('.' + currentImageClass).removeClass(currentImageClass);
    $('.' + nextImageClass).removeClass(nextImageClass);

    // update the index for the next id
    if (currentImageIndex >= (galleryImages.length-1)) {
      currentImageIndex = 0;
    } else {
      currentImageIndex++;
    }

    // update the index for the next id
    if (nextImageIndex >= (galleryImages.length-1)) {
      nextImageIndex = 0;
    } else {
      nextImageIndex++;
    }

    // add the classes to the new elements
    $(galleryImages[currentImageIndex]).addClass(currentImageClass);
    $(galleryImages[nextImageIndex]).addClass(nextImageClass);
  }, 5000);

})