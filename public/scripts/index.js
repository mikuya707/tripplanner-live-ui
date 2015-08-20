$(document).ready(function(){
	console.log("ready");
	var days = [];
	var itinerary = {
		hotels: [],
		activities: [],
		restaurants: []
	};
	var currDay = +$('.current-day').text();

	// days.push({
	// 	hotels: ['test'],
	// 	activities: ['test'],
	// 	restaurants: ['test']
	// });
	var getCurrDay = function() {
		currDay = +$('.current-day').text();
	};

	var clearPanel = function() {
		console.log('cleared');
		$('#hotels').empty();
		$('#restaurants').empty();
		$('#activities').empty();
	};

	var populatePanel = function(day) {
		var data = days[day-1];
		for (var key in data) {
			for (var i = 0; i < data[key].length; i++) {
				var optionElement = $('<div class="itinerary-item"><span class="title">'+data[key][i]+'</span><button class="btn btn-xs btn-danger remove btn-circle itemRemove">x</button></div>');
				console.log(optionElement);
				$('#'+key).append(optionElement);
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

	Array.prototype.slice.call($('.day-btn')).forEach(function(el, idx){
		if (el.textContent !== '+') {
			days.push(itinerary);
		}
	});
	$('#control-panel').on("click", "button", function(){
		console.log($(this));
		var option;
		var title;
		getCurrDay();
		if($(this).text() === "+" && !$(this).attr('id')){
			title = $(this).siblings('h4').text().toLowerCase();
			option = $(this).siblings('select').val();
			if(days[currDay-1][title].indexOf(option) === -1){
				var optionElement = $('<div class="itinerary-item"><span class="title">'+option+'</span><button class="btn btn-xs btn-danger remove btn-circle itemRemove">x</button></div>');
				$('#'+title).append(optionElement);
				days[currDay-1][title].push(option);
				console.log(days);
			}
			else{
				prompt("Item already exists in the itinerary!");
			}
		}
		else if ($(this).text() === "x"){
			console.log($(this).attr('class'));
			if($(this).hasClass("itemRemove") ){
				title = $(this).parents('ul').siblings('h4').text().toLowerCase().split(' ')[1];
				option = $(this).siblings('span').text();
				console.log("title " + title + "option " + option);
				var target = $(this).parent();
				target.remove();
				days[currDay-1][title].splice(days[currDay-1][title].indexOf(option), 1);
			}
		}
		else if($(this).attr('id') === 'addDay'){
			var newDay = +$(this).prev().text() + 1;
			var newDayElem = '<button class="btn btn-circle day-btn">'+newDay+'</button>';
			$(newDayElem).insertBefore($(this));
		} else if (buttonChecker($(this))) {
			console.log('got here');
			clearPanel();
			$('.current-day').removeClass('current-day');
			$(this).addClass('current-day');
			populatePanel(+$(this).text()-1);
		}

	});
}); 