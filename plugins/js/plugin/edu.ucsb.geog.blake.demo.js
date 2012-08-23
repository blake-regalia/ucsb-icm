/**


==Info==
	@name        Wireless Access Point Visualizer
	@author      Blake Regalia
	@email       blake@geog.ucsb.edu
	@description Visualizes the Wireless Access Point data collected on campus
	@version     1
==/Info==


<plugin>

	<data>
		<connect name="waps" datum="WGS84" georef="dec-degs" fields="lat,lng">
			/waps@(`status`='ready')
		</connect>
		
		<connect name="bldgs" datum="WGS84" georef="dec-degs" fields="coordinates">
			ucsb/facilities.building#[`coordinates`]
		</connect>
	</data>
	
</plugin>


<layout for="panel">

	<item-set src="waps#[`ssid`]" name="ssid-filter">
		<label src="ssid"/>
		<value src="ssid"/>
	</item-set>
	
	
</layout>


<layout for="popup.wap-info">
	
	<info name="events">
		<title>Events: </title>
	</info>
	
	<button name="view-data">
		<title>View events</title>
	</button>

</layout>


**/

Database.getNumberOf = function(dbName, query, callback) {
	global(dbName).get(
		query.sum(fieldName, value)
	, callback);
};

var filled = new Map.Shape.Polygon({
	border: {
		width: '2px',
		color: 'black',
		opacity: '80%',
	},
	fill: {
		color: 'navy',
		opacity: '22%',
	},
});

bldgLayer = Map.plot(bldgs, filled);

var shape = new Map.Shape.Dot({
	diameter: '6px',
});

var grad = new Color.Gradient({
	0: 'red',
	1: 'blue',
});

$('#ssid-filter').select(function(item) {
	
	waps.get(query('ssid',item.value).distinct('bssid'), function(bssidList) {
		
		//  "/events+"+query.or('bssid',bssidList)+"#(`bssid`)"
		Database('/events').getNumberOf(query.or('bssid',bssidList).distinct('bssid'), function(totalEvents, minEvents, maxEvents) {
			
			waps.get(query('ssid',item.value), function(data) {
				
				data.each(function(wap) {
					
					var plot = Map.plot(wap);
					Database('/events').getNumberOf('bssid',wap.bssid, function(numEvents) {
						
						plot.set({
							color: grad((numEvents-minEvents) / maxEvents),
							click: {
								'popup.wap-info': function() {
									return {
										title: wap.bssid+' - '+wap.ssid,
										events: {
											value: numEvents,
										},
										'view-data': {
											action: function() {
												viewData(wap);
											},
										},
									};
								},
							},
						});
					});
				});
			});
		});
	});
});

var viewData = function(wap) {
	
};