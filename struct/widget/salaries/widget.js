
/****


Map: {
	plotPoint
	plotCircle
	plotPolygon
	pointOut
}


Coordinates({
	latitude: 34.23117,
	longitude: -119.65817
}).convert();


Database: {
	minValue(field)
	maxValue(field)
	find(indexCriteria, fun)
	search(criteria, each)
	
	select(query)
}


Color: {
	gradient
}

Unit: {

currencies
	money
	pounds
	$
	dollars
	euros

name
	proper

geodetic
	dms
	dmsLat
	dmsLon

temporal
	date
	time
	time12h
	time24h

length
	feet
	inches
	in
	feetInches
	millimeters
	mm
	centimeters
	cm
	meters
	m
	kilometers
	km

speed
	mph
	milesPerHour
	kmh
	kilometersPerHour
	mps
	metersPerSecond
	fps
	feetPerSecond
	
storage
	b
	bytes
	kb
	kilobytes
	mb
	megabytes
	gb
	gigabytes
	tb
	terrabytes
	
	f
	flop
	kf
	kiloflop
	mf
	megaflop
	gf
	gigaflop
	tf
	terraflop
	
	bps
	bytesPerSecond
	kbps
	kilobytesPerSecond
	mbps
	megabytesPerSecond
	gbps
	gigabytesPerSecond
	
string
	upperCase
	lowerCase
}

****/


$(layout).ready(function() {
	
	var salaries = Database.get('blake@geog.ucsb.edu:salaries.2012');
	
	
	
	var searchBox = new SearchBox('#search');
	
	var staff = new ItemSet('ucsb.directory.staff');
	staff.setPrimaryItem('@lastName',', ','@firstName');
	
	var faculty = new ItemSet('ucsb.directory.faculty');
	faculty.setPrimaryItem('@firstName',' ','@lastName');
	
	searchBox.addItemSet(staff);
	searchBox.addItemSet(faculty);
	
	searchBox.setItemAction(function(itemSet, itemText, itemObj) {
		if(itemSet.descendsFrom(ucsb.directory)) {
			var person = itemObj;
			
			var criteria = {
				name: person.lastName
			};
			
			salaries.search(criteria, function(found, item) {
				if(found) {
					$('#salary').val(item.salary);
					var office = new Room(item.office);
					Map.pointOut(office.location);
				}
			});
		}
	});
	
	
	var subset = salaries.select({
		'income>': '250,000',
		'campus=': ['ucsb','ucsd'],
		'name!=': ['personal','confidential'],
	});
	
	var heatGradient = new Color.gradient('red','blue');
	
	var minIncome = salaries.minValue('income');
	var maxIncome = salaries.maxValue('income');
	var incomeRange = maxIncome - minIncome;
	
	subset.each(function(item) {
		var xy = Coordinates.convert({
			latitude: item.latitude,
			longitude: item.longitude,
		});
		Map.plotPoint(xy, {
			color: heatGradient((item.income-minIncome) / incomeRange),
			click: function() {
				UI.infoBox(e, {
					title: item.income,
					content: '...lookup person..'
				});
			},
			hover: function(e) {
				UI.textBox(e, Unit.$(item.income));
			},
		});
	});
	
	salaries.select("`income` > '25000' AND `campus` = 'ucsb'");
});