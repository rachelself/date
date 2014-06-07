/* global google:true */
/* jshint unused:false */
/* jshint camelcase:false */

(function(){
  'use strict';

  var auth = {

                consumerKey : 'WEz9zmdqOri9CSTj367tbg',
                consumerSecret : 'OcaD6T1q8lgpKmJrWV2T54I8jlo',
                accessToken : 'FbawWPLyM6Y2XoUKYOmBvHhAAGf3q4l0',
                accessTokenSecret : 'O3ZjrC8FAjUgga7xmclON1INUyQ',
                serviceProvider : {
                    signatureMethod : 'HMAC-SHA1'
                }
            };


  $(document).ready(init);

  function init()
  {
    initMap(38, -80, 3);
    $('#search').click(search);
  }

  var map;
  var charts = {};

  function initMap(lat, lng, zoom)
  {
    let styles = [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function search()
  {
    let zip = $('#zip').val().trim();
    let radius = $(`select[name='radius']`).val();
    $('#zip').focus();
    geoCode(zip);
    getNearby();
  }

  function geoCode(zip)
  {
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

  function addMarker(lat, lng, name, icon='../img/pin.png')
  {
    let LatLng = new google.maps.LatLng(lat,lng);
    new google.maps.Marker({map: map, position: LatLng, title: name, icon: icon});
  }

  function getNearby()
  {
    var terms = 'food';
    var near = 'San+Francisco';

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'http://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    // oAuth is not defined;
    // OAuth.setTimestampAndNonce(message);
    // OAuth.SignatureMethod.sign(message, accessor);

    // var parameterMap = OAuth.getParameterMap(message.parameters);
    // console.log(parameterMap);
    //
    // $.ajax({
    //     'url' : message.action,
    //     'data' : parameterMap,
    //     'dataType' : 'jsonp',
    //     'jsonpCallback' : 'cb',
    //     'success' : function(data, textStats, XMLHttpRequest) {
    //         console.log(data);
    //         //$("body").append(output);
    //     }
    // });
    // var url = 'http://api.yelp.com/business_review_search?term=yelp&lat=' + window.loc.lat + '&long=' + window.loc.lng + '&radius=' + radius + '&limit=10&ywsid=EJDoFH3OEMV8iJKwE3pfag&category=restaurants&callback=?';
    // $.getJSON(url, addRestaurantsToMap);
  }

})();
