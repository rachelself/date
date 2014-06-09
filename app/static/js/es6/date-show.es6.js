/* global google, moment */
/* jshint unused:false */
/* jshint camelcase:false */


function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init() {
    initMap(36.17, -86.778, 13);
    geoLocate();
    renderDateTime();
    $('#directions').click(getDirections);
  }


  function renderDateTime() {
    var day = $('#time').attr('data-day');
    day = moment(day).format('MMM Do YYYY, h:mm a');

    $('.when').append(day);
  }

  var map;
  var start;
  var end;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();


  function initMap(lat, lng, zoom) {
    let styles = [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function geoLocate() {
    var options = {enableHighAccuracy: true, timeout: 60000, maximumAge: 0};
    navigator.geolocation.getCurrentPosition(
      p=>{
        centerMap(p.coords.latitude, p.coords.longitude);
        map.setZoom(12);
        addMarker(p.coords.latitude, p.coords.longitude, 'Me', '/img/geoLocate.png', 'save');
        start = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
      },
      e=>console.log(e),
      options);
  }

  function centerMap(lat, lng) {
    var latLng = new google.maps.LatLng(lat, lng);
    map.setCenter(latLng);
  }

  function addMarker(lat, lng, name, icon='../img/pin.png') {
    let LatLng = new google.maps.LatLng(lat,lng);
    new google.maps.Marker({map: map, position: LatLng, title: name, icon: icon});
  }

  /* Map Directions Code Below */

  function getDirections() {
    var destLat = $(this).attr('data-lat');
    var destLng = $(this).attr('data-lng');
    end = new google.maps.LatLng(destLat, destLng);

    initialize(destLat, destLng);
  }

  function initialize(destLat, destLng) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var destination = new google.maps.LatLng(destLat, destLng);
    var mapOptions = {
      zoom: 11,
      center: destination
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    calcRoute();
  }

  function calcRoute() {
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }


})();
