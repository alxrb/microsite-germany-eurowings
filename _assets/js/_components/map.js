

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

function mapClose(e){
  e.preventDefault();
  // enable scrolling on background content
  $('body').removeClass('map-disable-scroll');
  $('.map__wrap').removeClass('is-open').addClass('is-closed');
}

$('.js-close-map').click(function(){ mapClose(event); });

// closes modal on escape key press
$(document).keyup(function(event) {
  if (event.keyCode == 27) {
    mapClose(event);
  }
});


///////////////////////////////////////
//      Interactive map
///////////////////////////////////////
if( $('#map').length ){
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
          "icon-image": "airport-15", // custom icon is in the mapbox style spritesheet
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

      ///////////// adds highlights markers to the map
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
          "circle-color": "#c11b28",
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
          "text-color": "#ffffff"
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
      map.on('click', 'pois', function (e) {
        var clickedPoiId = e.features[0].properties.id
        console.log(clickedPoiId);
        modalOpen(null, clickedPoiId);
      });

      ///////////// center the map markers within the viewport
      var bounds = new mapboxgl.LngLatBounds();
      function getMapBounds() {
        poiMarkers.features.forEach(function(feature) {
          bounds.extend(feature.geometry.coordinates);
        });
        airportMarkers.features.forEach(function(feature) {
          bounds.extend(feature.geometry.coordinates);
        });
        // set different padding depending on original viewport width
        // not super precise but should catch mobile phones and reduce the padding
        var iconPadding;
        if ($(window).innerWidth() < 400) {
          iconPadding = { "padding": 40 };
        } else {
          iconPadding = { "padding": 120 };
        }
        map.fitBounds(bounds, iconPadding); // adds padding so markers aren't on edge

      }
      getMapBounds(); // resets the view when the map loads

    });
  }
  map();
}