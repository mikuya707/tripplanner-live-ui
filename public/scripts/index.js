$(document).ready(function() {
   var days = [];
   var currDay = +$('.current-day').text();
   var database = {
      hotels: all_hotels,
      activities: all_activities,
      restaurants: all_restaurants
   };
   var images = {
      hotels: '/images/lodging_0star.png',
      activities: '/images/star-3.png',
      restaurants: '/images/restaurant.png'
   };
   // initialize new google maps LatLng object
   var myLatlng = new google.maps.LatLng(40.705189, -74.009209);
   // set the map options hash
   var mapOptions = {
      center: myLatlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styleArr
   };
   // get the maps div's HTML obj
   var map_canvas_obj = document.getElementById("map-canvas");
   console.log(map_canvas_obj);
   // initialize a new Google Map with the options
   var map = new google.maps.Map(map_canvas_obj, mapOptions);

   // Creates the days object on page load based on how many days the page starts with
   Array.prototype.slice.call($('.day-btn')).forEach(function(el, idx) {
      if (el.textContent !== '+') {
         days.push({
            hotels: [],
            activities: [],
            restaurants: [],
            markers: []
         });
      }
   });

   // Helper function to reset the currDay variable
   var getCurrDay = function() {
      currDay = +$('.current-day').text();
   };

   // Removes all items from hotels, restaurants, activities
   var clearPanel = function() {
      $('#hotels').empty();
      $('#restaurants').empty();
      $('#activities').empty();
   };

   // Populates the panel on switch days
   var populatePanel = function(day) {
      var data = days[day - 1];
      for (var key in data) {
         if (key !== 'markers') {
            for (var i = 0; i < data[key].length; i++) {
               var optionElement = $('<div class="itinerary-item"><span class="title">' + data[key][i] + '</span><button class="btn btn-xs btn-danger remove btn-circle itemRemove">x</button></div>');
               $('#' + key).append(optionElement);
            }
         }
      }
   };

   var buttonChecker = function(element) {
      if ((element.hasClass('day-btn') && (element.attr('id') !== 'addDay')) && !element.hasClass('current-day')) {
         return true;
      } else {
         return false;
      }
   };

   // Get latLng of item added
   // Check if its a hotel, activity, or restaurant
   // Create the marker object with the latLng with the correct image
   function getLocation(type, name) {
      for (var i = 0; i < database[type].length; i++) {
         if (database[type][i].name === name) {
            return database[type][i].place[0].location;
         }
      }
   }

   function drawLocation(location, opts) {
      if (typeof opts !== 'object') {
         opts = {};
      }
      opts.position = new google.maps.LatLng(location[0], location[1]);
      opts.map = map;
      var marker = new google.maps.Marker(opts);
      return marker;
   }

   function removeMarker(name) {
      days[currDay-1].markers.forEach(function(el, idx){
         if (el[name]) {
            el[name].setMap(null);
            days[currDay-1].markers.splice(idx, 1);
         }
      });
   }

   function clearMap() {
      console.log(days);
      days[currDay-1].markers.forEach(function(el){
         el[Object.keys(el)[0]].setMap(null);
      });
   }

   function populateMap() {
      days[currDay-1].markers.forEach(function(el){
         el[Object.keys(el)[0]].setMap(map);
      });
   }

   $('#control-panel').on("click", "button", function() {
      var option;
      var title;
      var location;
      // Add an item
      if ($(this).text() === "+" && !$(this).attr('id')) {
         getCurrDay();
         title = $(this).siblings('h4').text().toLowerCase();
         option = $(this).siblings('select').val();
         if (days[currDay - 1][title].indexOf(option) === -1) {
            var optionElement = $('<div class="itinerary-item"><span class="title">' + option + '</span><button class="btn btn-xs btn-danger remove btn-circle itemRemove">x</button></div>');
            $('#' + title).append(optionElement);
            days[currDay - 1][title].push(option);
            // Creating map marker object
            location = getLocation(title, option);
            var marker = drawLocation(location, {
               icon: images[title]
            });
            var newObj = {};
            newObj[option] = marker;
            days[currDay-1].markers.push(newObj);
         } else {
            alert("Item already exists in the itinerary!");
         }
      }
      // Remove an item
      else if ($(this).text() === "x" && $(this).attr('id') !== 'dayRemove') {
         getCurrDay();
         if ($(this).hasClass("itemRemove")) {
            title = $(this).parents('ul').siblings('h4').text().toLowerCase().split(' ')[1];
            option = $(this).siblings('span').text();
            var target = $(this).parent();
            target.remove();
            removeMarker(option);
            days[currDay - 1][title].splice(days[currDay - 1][title].indexOf(option), 1);
         }
      }
      // Add a day
      else if ($(this).attr('id') === 'addDay') {
         getCurrDay();
         var newDay = +$(this).prev().text() + 1;
         var newDayElem = '<button class="btn btn-circle day-btn">' + newDay + '</button>';
         $(newDayElem).insertBefore($(this));
         days.push({
            hotels: [],
            activities: [],
            restaurants: []
         });
      }
      // Switch days
      else if (buttonChecker($(this))) {
         getCurrDay();
         clearMap();
         clearPanel();
         $('.current-day').removeClass('current-day');
         $(this).addClass('current-day');
         getCurrDay();
         populatePanel(currDay);
         populateMap();
         $("#dayValue").text('Day ' + currDay);
      }
      // Remove a day
      else if ($(this).attr('id') === 'dayRemove') {
         console.log('got here');
         getCurrDay();
         days.splice(currDay - 1, 1);
         clearPanel();
         clearMap();
         var btnsToChange = $(".current-day").nextAll();
         $(".current-day").remove();
         $(btnsToChange[0]).addClass('current-day');
         for (var i = 0; i < btnsToChange.length - 1; i++) {
            var currVal = +$(btnsToChange[i]).text();
            $(btnsToChange[i]).text(currVal - 1);
         }
         getCurrDay();
         populatePanel(currDay);
         populateMap();
      }
   });

   function initialize_gmaps() {


      // Add the marker to the map
      var marker = new google.maps.Marker({
         position: myLatlng,
         title: "Hello World!"
      });

   }

   var styleArr = [{
      featureType: "landscape",
      stylers: [{
         saturation: -100
      }, {
         lightness: 60
      }]
   }, {
      featureType: "road.local",
      stylers: [{
         saturation: -100
      }, {
         lightness: 40
      }, {
         visibility: "on"
      }]
   }, {
      featureType: "transit",
      stylers: [{
         saturation: -100
      }, {
         visibility: "simplified"
      }]
   }, {
      featureType: "administrative.province",
      stylers: [{
         visibility: "off"
      }]
   }, {
      featureType: "water",
      stylers: [{
         visibility: "on"
      }, {
         lightness: 30
      }]
   }, {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{
         color: "#ef8c25"
      }, {
         lightness: 40
      }]
   }, {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{
         visibility: "off"
      }]
   }, {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{
         color: "#b6c54c"
      }, {
         lightness: 40
      }, {
         saturation: -40
      }]
   }];

   initialize_gmaps();
});
