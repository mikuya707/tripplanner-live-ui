$(document).ready(function(){
	console.log("ready");
	var itinerary = {
		hotels: [],
		activities: [],
		restaurants: []
	};

	$('#control-panel').on("click", "button", function(){
		console.log($(this));
		var option;
		var title;
		if($(this).text() === "+" && !$(this).attr('id')){
			console.log("this is not to add a date");
			title = $(this).siblings('h4').text().toLowerCase();
			option = $(this).siblings('select').val();
			if(itinerary[title].indexOf(option) === -1){
				var optionElement = $('<div class="itinerary-item"><span class="title">'+option+'</span><button class="btn btn-xs btn-danger remove btn-circle itemRemove">x</button></div>');
				$('#'+title).append(optionElement);
				itinerary[title].push(option);
				
			}
			else{
				prompt("Item already exists in the itinerary!");
			}
		}
		else if ($(this).text() === "x"){
			console.log($(this).attr('class'));
			if($(this).hasClass("itemRemove") ){
				title = $(this).parents('ul').siblings('h4').text().toLowerCase().split(' ')[1] + "s";
				option = $(this).siblings('span').text();
				console.log("title " + title + "option " + option);
				var target = $(this).parent();
				target.remove();
				itinerary[title].splice(itinerary[title].indexOf(option), 1);
			}
		}
		else if($(this).attr('id') === 'addDay'){
			var newDay = +$(this).prev().text() + 1;
			var newDayElem = '<button class="btn btn-circle day-btn">'+newDay+'</button>';
			$(newDayElem).insertBefore($(this));
		}

	})
})       