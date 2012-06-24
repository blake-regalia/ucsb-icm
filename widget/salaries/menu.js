$(layout).ready(function() {
	
	// create a reference to the user's dataset
	var salaries = Database.get('blake@geog.ucsb.edu:salaries.2012')
		.select("WHERE `income` >= '0' AND `income` != NULL AND `campus` = 'UCSB'");
	
	// create a color gradient
	var heatGradient = new Color.gradient({
		stops: [0, .2, 1],
		values: [
			'brown',
			'yellow',
			'green'
		],
		range: {
			// get the min and max values from a field in the table
			min: salaries('#income').minValue(),
			max: salaries('#income').maxValue(),
		},
	});
	
	
	// show this color scale in the legend
	Legend.addEntity({
		scale: heatGradient, 
		title: 'Yearly Income',
		unit: Unit.currency.dollars.thousands
	});
	
	
	// for each row in the table
	salaries.each(function(item) {
		
		// attempt to find that person using the Directory class
		var person = Directory.find(item.fullName);
		
		// if there are more than one person with that name
		if(person.conflict) {
			
			// attempt to reduce the set by filtering only staff and faculty
			person = person.filter({
				origin: ['ucsb.directory.staff','ucsb.directory.faculty'],
			});
			
			// if there still is a conflict, skip this person
			if(person.conflict) continue;
		}
		
		// if that person indeed exists and has an office
		if(person.hasOffice) {
		
			// obtain their location by allowing the Directory to resolve the office name to a location
			var xy = person.getLocation();
			
			// plot each entry as a point on the map
			Map.plotPoint(xy, {
				
				// set the color by it's gradient value among the total range
				color: heatGradient(item.income),
				
				// bind input event: click
				click: function() {
					UI.infoBox(e, {
						title: item.income,
						content: '...lookup person..'
					});
				},
				
				// bind input event: mouse-over
				hover: function(e) {
					UI.textBox(e, Unit.$(item.income));
				},
			});
		}
	});
	
});