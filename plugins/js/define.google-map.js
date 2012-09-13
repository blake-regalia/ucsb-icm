(function() {
	
	var __func__ = 'GoogleMap';
	
	var googleMaps;
	var defaultMapOptions;
	
	var instance;
	
	var construct = function(jqs, opts) {
		
		/**
		* private:
		**/
		var container = (function() {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			return jqsr[0];
		})();
		
		
		/**
		* protected:
		**/
		var options = $.extend(defaultMapOptions, opts);
		
		var map = new googleMaps.Map(container, options);
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			map: function() {
				return map;
			},
			
			plot: function(geometry, symbol, event) {
				
				geometry = new Geometry(geometry);
				
				symbol = new MapSymbol(symbol);
				
				var drawable = $.extend(symbol(), {
					paths: geometry(),
				});
				
				console.log(drawable);
				var overlay = new googleMaps[geometry.type](drawable);
				
				if(event) {
					if(event.click) {
						google.maps.event.addListener(overlay, 'click', function(e) {
							event.click.apply(event.data, [e.latLng]);
						});
					}
				}
				
				overlay.setMap(map);
			},
			
			$: function(qs) {
				return {
					show: function(what, where) {
						var infowindow = new google.maps.InfoWindow({
							content: '<div style="font-family:monospace;">'
									+'<table>'
										+'<tr><td># People:</td><td>'+what.persons+'</td></tr>'
										+'<tr><td>Average:</td><td>'+Unit(what.average,'currency.dollars')+'</td></tr>'
									+'</table>'
								+'</div>',
							position: where,
						});
						
						infowindow.open(map);
					},
				};
			},
		});
		
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(jqs) {
		
		googleMaps = google.maps;
		
		defaultMapOptions = {
			center: new googleMaps.LatLng(34.415606,-119.845323),
			zoom: 17,
			mapTypeId: googleMaps.MapTypeId.ROADMAP,
		};
		
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
	$.extend(global, {
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		//
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
	});
	
})();