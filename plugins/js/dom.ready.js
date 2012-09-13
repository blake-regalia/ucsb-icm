$(document).ready(function() {
	
	new GoogleMap('#map-canvas');

	ProgressIndicator(document.body);
	
	console.log(location.search);
	if(location.search == '?demo') {
		RunDemoPlugin();
	}
});

function RunDemoPlugin() {
	var ns = "edu.ucsb.geog.blake.salaries.js";
	var oc = $.extend({}, defaultObjectClass);
	
	var dataHelper = new DataHelper(ns, {
		'faculty': "ucsb/directory.people@(`type`='faculty')",
		'salaries': "edu.ucsb.geog.blake/salaries_2011",
	});
	$.extend(oc, {
		window: {},
		Data: dataHelper,
		Select: dataHelper,
		Map: GoogleMap(),
		$: GoogleMap().$,
	});
	plugin(ns, oc);
}