// general js for the project that wouldn't be a reuseable component


///////////////////////////////////////
//      open slideshow modal
///////////////////////////////////////

$('.js-open-slideshow').on('click', function(e) {
  e.preventDefault();
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('slideshow-disable-scroll');
  runSlideshow();
  $('.slideshow__wrap').removeClass('is-closed').addClass('is-open');
})

$('.js-close-slideshow').on('click', function(e) {
  e.preventDefault();
  // enable scrolling on background content
  $('body').removeClass('slideshow-disable-scroll');
  $('.slideshow__wrap').removeClass('is-open').addClass('is-closed');
})


///////////////////////////////////////
//  Home Image slider - extra fucntions
///////////////////////////////////////

function runSlideshow() {

  var homeCarousel      = $('#slideshow');
  var transitionSpeed   = 1250;
  var carouselLink      = $('.js-slideshow-link');
  var carouselLocation  = $('.js-slideshow-location');
  var activeSlide       = $('.owl-item.active > .slider__content');
  var hiddenElements    = '.slider__info, .owl-nav, .owl-dots';

  homeCarousel.owlCarousel({
    items:1,
    loop:true,
    autoHeight:true,
    dotsContainer: ".dots-container",
    nav: true,
    navElement: "div",
    navSpeed: transitionSpeed,
    smartSpeed: transitionSpeed,
    dragEndSpeed: (transitionSpeed / 3),
    callbacks:true
  });

  // This grabs the slide information from the data attributes to update the link
  // and location name for each slide.
  function sliderContentRefresh(){
    var currentLink     = $('.owl-item.active > .slideshow__item').data('link'),
        currentLocation = $('.owl-item.active > .slideshow__item').data('location');
    carouselLink.attr('href', currentLink);
    carouselLocation.text(currentLocation);
  }

  // the callbacks for the owlCarousel plugin are a bit crap and dont fire after
  // the animation. Also if you do two drags in a row, it is very easy to break.
  // This interval fires every half second to check the active class. I know its
  // gross, but its the most reliable way to write this code. And its a small
  // amount of processing every half second.
  setInterval(function() {
    if ($('.owl-item').hasClass('active')) {
      sliderContentRefresh();
    }
  }, 500);

  // starts to automatically cycle through slides
  // owlCarousel autoplay start stop events dont work. This is an alternate way
  // to make it auto advance and then stop when the user interacts with it
  var fauxAutoplay = setInterval(function() {
    homeCarousel.trigger('next.owl.carousel');
  }, (transitionSpeed*2.5));
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

}







///////////////////////////////////////
//            open map
///////////////////////////////////////

$('.js-open-map').on('click', function(e) {
  e.preventDefault();
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('map-disable-scroll');
  // dont reload the map if its already open
  if ($('#map').children().length === 0) { map(); }
  $('.map__wrap').removeClass('is-closed').addClass('is-open');
})

$('.js-close-map').on('click', function(e) {
  e.preventDefault();
  // enable scrolling on background content
  $('body').removeClass('map-disable-scroll');
  $('.map__wrap').removeClass('is-open').addClass('is-closed');
})


///////////////////////////////////////
//      Interactive map
///////////////////////////////////////

function map(){

  // launch map with settings
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hamishjgray/cjk416sz102mb2rrsfn7qgt41',
    logoPosition: 'bottom-right',
    zoom: 5,
    minZoom: 4,
    center: [9.3317989, 51.0899854]
  });

  // disable map rotation using right click + drag
  map.dragRotate.disable();

  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();

  // builds map with custom functionality
  map.on('load', function(event) {

    ///////////// add the poi marker data so it can create clusters
    map.addSource("poi-markers", {
      type: "geojson",
      data: poiMarkers,
      cluster: true,
      clusterMaxZoom: 14,
    });

    /////////// adds se offer markers to the map
    map.addLayer({
      id: 'se-offers',
      type: 'symbol',
      // Add a GeoJSON source containing place coordinates and information.
      source: {
        type: 'geojson',
        data: offerMarkers
      },
      layout: {
        "icon-image": "se-offer", // custom icon is in the mapbox style spritesheet
        "icon-size": .8,
        'icon-anchor': "bottom"
      }
    });

    ///////////// add airport markers to the map
    map.addLayer({
      id: 'airports',
      type: 'symbol',
      // Add a GeoJSON source containing place coordinates and information.
      source: {
        type: 'geojson',
        data: airportMarkers
      },
      layout: {
        "icon-image": "ew-airport-01", // custom icon is in the mapbox style spritesheet
        "icon-size": 1,
        'icon-anchor': "bottom",
        "text-field": "{title}",
        "text-font": ["Rubik Regular"],
        "text-size": 13,
        "text-anchor": "top",
        "text-letter-spacing": .02
      },
      paint: {
        "text-color": "#2e2e2e",
        "text-halo-color": "rgba(248,244,240,.66)",
        "text-halo-width": 3,
      }
    });

    ///////////// adds cities markers to the map
    map.addLayer({
      id: 'cities',
      type: 'symbol',
      // Add a GeoJSON source containing place coordinates and information.
      source: {
        type: 'geojson',
        data: cityMarkers
      },
      layout: {
        "icon-image": "fire-station-15", // custom icon is in the mapbox style spritesheet
        "icon-size": 1,
        'icon-anchor': "bottom"
      }
    });

    ///////////// adds cities markers to the map
    map.addLayer({
      id: 'pois',
      type: 'symbol',
      // Add a GeoJSON source containing place coordinates and information.
      source: {
        type: 'geojson',
        data: poiMarkers
      },
      layout: {
        "icon-image": "marker-15", // custom icon is in the mapbox style spritesheet
        "icon-size": 1,
        'icon-anchor': "bottom"
      }
    });

    ///////////// creates cluster shape layer to the map
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "poi-markers",
      filter: ["has", "point_count"],
      paint: { // style formatting for the cluster circle
        "circle-color": "#1f214d",
        "circle-radius": 22
      }
    });

    ///////////// adds cluster number data on top of shape
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "poi-markers",
      filter: ["has", "point_count"],
      layout: { // style formatting for cluster number
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Roboto Slab Bold"],
        "text-size": 22,
        "text-allow-overlap": true
      },
      paint: {
        "text-color": "#2baee5"
      }
    });

    ///////////// adds normal marker when there is no cluster
    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "poi-markers",
      filter: ["!has", "point_count"],
      layout: {
        "icon-image": "poi-star-01", // custom icon is in the mapbox style spritesheet
        "icon-size": .8,
        "icon-anchor": "bottom",
        "icon-allow-overlap": true
      }
    });

    ///////////// adds normal marker when there is no cluster
    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "poi-markers",
      filter: ["!has", "point_count"],
      layout: {
        "icon-image": "poi-star-01", // custom icon is in the mapbox style spritesheet
        "icon-size": .8,
        "icon-anchor": "bottom",
        "icon-allow-overlap": true
      }
    });

    ///////////// zooms in the map a bit to break the cluster on click
    map.on('click', 'clusters', function (e) {
      map.flyTo({
        center: e.lngLat,
        zoom: map.getZoom() + 1.5
      });
      // would like to get this so that the zoom level goes until the cluster separates, but after half a day of looking turns out it is a bit too complicated
    });

    // ///////////// Launches POI modal when marker is clicked
    // map.on('click', 'unclustered-point', function (e) {
    //   var clickedModalId = e.features[0].properties.id
    //   modalOpen(null, clickedModalId);
    // });

    ///////////// Launches offer card modal when se offer marker is clicked
    map.on('click', 'se-offers', function (e) {
      var clickedOfferId = e.features[0].properties.id;
      console.log(clickedOfferId);
      modalOpen(null, clickedOfferId);
    });

    // ///////////// Opens station information in a new window when clicked
    // map.on('click', 'stations', function (e) {
    //   var clickedStationLink = e.features[0].properties.link
    //   window.open(clickedStationLink, '_blank');
    // });

    ///////////// center the map markers within the viewport
    var bounds = new mapboxgl.LngLatBounds();
    function getMapBounds() {
      poiMarkers.features.forEach(function(feature) {
        bounds.extend(feature.geometry.coordinates);
      });
      offerMarkers.features.forEach(function(feature) {
        bounds.extend(feature.geometry.coordinates);
      });
      airportMarkers.features.forEach(function(feature) {
        bounds.extend(feature.geometry.coordinates);
      });
      cityMarkers.features.forEach(function(feature) {
        bounds.extend(feature.geometry.coordinates);
      });
      // set different padding depending on original viewport width
      // not super precise but should catch mobile phones and reduce the padding
      var iconPadding;
      if ($(window).innerWidth() < 400) {
        iconPadding = { "padding": 30 };
      } else {
        iconPadding = { "padding": 60 };
      }
      map.fitBounds(bounds, iconPadding); // adds padding so markers aren't on edge

    }
    getMapBounds(); // resets the view when the map loads

  });
}