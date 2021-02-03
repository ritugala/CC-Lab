$(document).on('click', '.btn-add', function(e){

            
  e.preventDefault();
    
  var controlForm = $('.controls form:first'),
  currentEntry = $(this).parents('.entry:first'),
  newEntry = $(currentEntry.clone()).appendTo(controlForm);

  newEntry.find('input').val('');
            

  controlForm.find('.entry:not(:last) .btn-add')
   .removeClass('btn-add').addClass('close')
   .html("x");
                
}).on('click', '.close', function(e){

  var d=$(this).siblings("input");
  var id_d=d.attr('id');
  var id_n=id_d.charAt(id_d.length-1);
  markers.splice(id_n-1, 1);
  
  $(this).parents('.entry:first').remove();
  
  e.preventDefault();
  return false;

}).on('click', '.form-control', function(){
            
  var input_added = document.querySelectorAll('.form-control');
           
            // Set their ids
  for (var i = 1; i <= input_added.length; i++){  
    console.log(i+"");
    input_added[i-1].id = 'abc-' + i;
    input_added[i-1].name='xyz-' + i;
  }

  var currentInp = $(this).attr("id");
  var placeBox = new google.maps.places.Autocomplete(document.getElementById(currentInp));

}).on('click', '.btn-add', function(e){   
  var d=$(this).siblings("input");
  var id_d=d.attr('id');
  submit_clicked=false;
  geocodeAddress(new google.maps.Geocoder(), document.getElementById('map'), id_d);
}).on('click', '.btn_submit', function(e){
  var d=$(".btn-add").siblings("input");
  var id_d=d.attr('id');
  submit_clicked=true;
  geocodeAddress(new google.maps.Geocoder(), document.getElementById('map'), id_d);

});        

document.getElementsByClassName("close").value="x";
document.getElementsByClassName("btn-add").value="+";
var map;
var directionsService, directionsRenderer;
var markers=[];
var mid_loc;
var marker;
var autocomplete;
var service;
var submit_clicked=false;

function initialize(){
  initMap();
  initAutocomplete();
}

function initMap() {
  console.log("initmap called");
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 19.0760, lng: 72.8777},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var geocoder = new google.maps.Geocoder();

          
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({map: map});
  service = new google.maps.places.PlacesService(map);
          
}

function geocodeAddress(geocoder, resultsMap, id_d) {
          
  console.log("geocoder called"+" "+id_d);
  var n=id_d.charAt(id_d.length-1);

  var address = document.getElementById(id_d).value;

  geocoder.geocode({'address': address}, function(results, status) {
  if (status === 'OK' ) {
              
    map.setCenter(results[0].geometry.location);
    marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location,
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });

    markers.push(marker);
   
    var bounds = new google.maps.LatLngBounds();
    var sum_lat=0;
    var sum_long=0;
    var m_n=markers.length;
    for (var i = 0; i < m_n; i++) {
      bounds.extend(markers[i].getPosition());
      sum_lat+=markers[i].getPosition().lat();
      sum_long+=markers[i].getPosition().lng();          
    }

    mid_loc=new google.maps.LatLng(sum_lat/m_n, sum_long/m_n);
    if(n>1){
      initMap();
      for (var i = 0; i < markers.length; i++) {
        var loc_1=new google.maps.LatLng(markers[i].getPosition().lat(),markers[i].getPosition().lng());
        requestDirections(loc_1, mid_loc);
      }
      if(submit_clicked==true){
        findrest(mid_loc);
      }
    }
              
    if(n>1){
      map.fitBounds(bounds);
    }

  } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function setMapOnAll(map) {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
}

function clearMarkers() {
          setMapOnAll(null);
}
  
function initAutocomplete() {
              
              // Create the autocomplete object, restricting the search predictions to
              // geographical location types.
              
              //do something with each element
              autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"),{types: ['geocode']});
              
              // Avoid paying for data that you don't need by restricting the set of
              // place fields that are returned to just the address components.
              autocomplete.setFields(['address_component']);
}

function geolocate() {
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(function(position) {
                  var geolocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  };
                  var circle = new google.maps.Circle(
                      {center: geolocation, radius: position.coords.accuracy});
                      autocomplete.setBounds(circle.getBounds());
                  });
              }
}

function calculateAndDisplayRoute(directionsRenderer, directionsService, map, val_ori, val_dest) {
    
            // Retrieve the start and end locations and create a DirectionsRequest using
            // WALKING directions.
            directionsService.route({
              origin: val_ori,
              destination: val_dest,
              travelMode: 'DRIVING'
            }, function(response, status) {
              // Route the directions and pass the response to a function to create
              // markers for each step.
              if (status === 'OK') {
                
                directionsRenderer.setDirections(response);
                
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
}

function renderDirections(result) { 
              var directionsRenderer = new google.maps.DirectionsRenderer(); 
              directionsRenderer.setMap(map); 
              directionsRenderer.setDirections(result); 
}     
      
function requestDirections(start, end) { 
            directionsService.route({ 
              origin: start, 
              destination: end, 
              travelMode: google.maps.DirectionsTravelMode.DRIVING 
            }, function(result) { 
              renderDirections(result); 
            }); 
} 
  

function findrest(mid_loc){
  
  var request = {
    location: mid_loc,
    radius: '500',
    type: ['restaurant']
  };
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var bounds = new google.maps.LatLngBounds();
    //display_info(results);
    for (var i = 0; i < results.length; i++) {
      var a1 = "<div class=card rest style=max-width: 18rem;><div class=row no-gutters>";
      var a2="<div class=card-body><h5 class=card-title>";
      var a3="</h5><p class=card-text>";
      var a4="</p></div></div></div>";

      console.log(results[i]);

      var g= document.createElement('div');

      g.marker=new google.maps.Marker({
        map:map,
        position: results[i].geometry.location,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'        
      });5
      bounds.extend(g.marker.getPosition());
      g.onmouseover=function(){this.marker.setAnimation(google.maps.Animation.BOUNCE);};
      g.onmouseout=function(){this.marker.setAnimation(null);};
      g.id = i;
      document.getElementById("only_card").appendChild(g);
      var rate;
      if(results[i].rating==null){
        rate="Not Available";
      }
      else {
        rate=Math.round(results[i].rating);
      }
      var abcd = a1 + "<div><i class=fas fa-utensils></i></div>" + a2 + results[i].name+"  Rating: " + rate + a3 + results[i].vicinity + a4;
      document.getElementById(g.id).innerHTML=abcd;    
    }
    map.fitBounds(bounds);
  }
}
