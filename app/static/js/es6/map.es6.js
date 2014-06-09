/* global google:true */
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
    $('#search').click(clearListing);
    $('#search').click(getLocations);
    $('#map').on('click', '.directions', getDirections);
    $('#searchListing').on('click', '.dateLocation', chooseDateLocation);
    $('#searchListing').on('click', '.editDate', editDate);
    $('#searchListing').on('click', '.confirmDate', createDate);
  }

  function createDate(){
    var obj = {};
    obj.rating = $(this).attr('data-rating');
    obj.lat = $(this).attr('data-lat');
    obj.lng = $(this).attr('data-lng');
    obj.url = $(this).prev().attr('href');
    obj.name = $(this).siblings('h3').text();
    obj.address1 = $(this).siblings('.address1').text();
    obj.city = $(this).attr('data-city');
    obj.state = $(this).attr('data-state');
    obj.zip = $(this).attr('data-zip');
    obj.phone = $(this).attr('data-phone');
    obj.ratingImg = $(this).attr('data-ratingImg');
    obj.day = $('#date').val();
    obj.time = $('#time').val();
    obj.inviteeId = $('#invitee').attr('data-id');//test. needs to be in data-inviteeId within document
    obj.availability = $('#availability').val();
    ajax('/dates', 'POST', obj, jsonObj=>{
      window.location = '/users';
    }, 'json');
  }

  function editDate() {
    $('#cityOrZip').show();
    $('#companyName').show();
    $('#search').show();
    clearListing();
    initMap(36.17, -86.778, 13);
    geoLocate();
  }

  function chooseDateLocation() {
    var obj = {};
    obj.rating = $(this).attr('data-rating');
    obj.lat = $(this).attr('data-lat');
    obj.lng = $(this).attr('data-lng');
    obj.url = $(this).prev().attr('href');
    obj.address1 = $(this).siblings('.address1').text();
    obj.city = $(this).attr('data-city');
    obj.state = $(this).attr('data-state');
    obj.zip = $(this).attr('data-zip');
    obj.phone = $(this).attr('data-phone');
    obj.ratingImg = $(this).attr('data-ratingImg');
    obj.name = $(this).siblings('h3').text();

    $('#searchListing').empty();
    $('#cityOrZip').hide();
    $('#companyName').hide();
    $('#search').hide();
    createSearchListing(obj);
    $('.dateLocation').text('Send Invitation').addClass('confirmDate');
    $('.dateLocation').after('<button class="editDate">Edit Invitation</button>');
    end = new google.maps.LatLng(obj.lat, obj.lng);
    initialize(obj.lat, obj.lng);
  }


  /* Global variable for map */
  var map;
  /* Global variable for yelp search listing */
  var listing = [];

  function initMap(lat, lng, zoom) {
    let styles = [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addMarker(lat, lng, name, icon='../img/pin.png') {
    let LatLng = new google.maps.LatLng(lat,lng);
    new google.maps.Marker({map: map, position: LatLng, title: name, icon: icon});
  }

  /* Yelp API request */

  function getLocations() {
    let term = $('#companyName').val().trim();
    let cityOrZip = $('#cityOrZip').val().trim().replace(/[,]+[, ]/g, '+').replace(/ /g, '+');
    let url = 'http://api.yelp.com/business_review_search?term='+ term +'&location='+ cityOrZip +'&limit=8&ywsid=x0GtqSl0Gm8wp0_8A7L2fw&callback=?';
    console.log(url);
    $.getJSON(url, addRestaurantsToMap);
    $('#cityOrZip').val('');
    $('#companyName').val('');
  }

  function addRestaurantsToMap(data) {
    $.each(data.businesses, function(i, business) {
      formatRestaurant(business);
    });
  }

  function formatRestaurant(entry) {
    var geocoder = new google.maps.Geocoder();
    var address = entry.address1 + ',' + entry.city + ',' + entry.state + ',' + entry.country + ',' + entry.zip;
    var location = {};
    location.name = entry.name;
    location.address1 = entry.address1;
    location.city = entry.city;
    location.state = entry.state;
    location.zip = entry.zip;
    location.phone = entry.phone;
    location.url = entry.mobile_url;
    location.rating = entry.avg_rating;
    location.ratingImg = entry.rating_img_url_small;
    geocoder.geocode({ 'address' : address }, function(restaurant, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        location.lat = restaurant[0].geometry.location.lat();
        location.lng = restaurant[0].geometry.location.lng();
        addRestaurantMarkers(location, location.lat, location.lng, location.name);
        // listing.push(location);
        createSearchListing(location);
      } else {
        alert(status);
      }
    });
  }

  function createSearchListing(listing) {
    var div = `<div class='${listing.name}'>
              <h3>${listing.name}</h3>
              <div><img src='${listing.ratingImg}'></div>
              <p class='address1'>${listing.address1}</p>
              <p>${listing.city}, ${listing.state} ${listing.zip}</p>
              <p>${listing.phone}</p>
              <a href='${listing.url}'>View on Yelp</a>
              <button class='dateLocation', data-city='${listing.city}', data-state='${listing.state}', data-zip='${listing.zip}',
              data-phone='${listing.phone}', data-ratingImg='${listing.ratingImg}', data-rating='${listing.rating}', data-lat='${listing.lat}', data-lng='${listing.lng}'>This is it!</button>
              </div>`;
    $('#searchListing').append(div);
  }

  function clearListing(){
    $('#searchListing').empty();
  }

  function geoCode(zip) {
    let geocoder = new google.maps.Geocoder();

      geocoder.geocode({address: zip}, (results, status)=>{
        let name = results[0].formatted_address;
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();

        addMarker(lat, lng, name, '../img/pin.png');
        let LatLng = new google.maps.LatLng(lat, lng);
        map.setCenter(LatLng);
        map.setZoom(5);
      });
  }

  function addRestaurantMarkers(info, lat, lng, name, type, icon='../img/pin.png') {
    var latLng = new google.maps.LatLng(lat, lng);
    var contentString = `<div class='infoWindow'><h3 class='destName'>${info.name}</h3>
                        <p><img src='${info.ratingImg}'></p>
                        <p>${info.address1}</p>
                        <p>${info.city}, ${info.state} ${info.zip}</p>
                        <a href='${info.url}'>View on Yelp</a>
                        <a href='#', class='directions', data-lat='${lat}', data-lng='${lng}'>Get Directions</p>
                        </div>`;
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({map: map, position: latLng, title: name, info:info});
    google.maps.event.addListener(marker, 'click', function(){
      infowindow.open(map,marker);
    });
  }

  /* Global Variables for Directions */
  var start;
  var end;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

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
