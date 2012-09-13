(function() {
	
	var __func__ = 'MapSymbol';
	
	var googleMaps;
	
	
	var construct = function(obj) {
		
		if(obj.isMapSymbol) {
			return obj;
		}
		
		/**
		* private:
		**/
		var symbol = {};
		
		(function() {
			
			var style  = obj.style;
			var fill   = obj.fill;
			var stroke = obj.stroke;
			
			if(style) {
				style = style[0].toUpperCase()+style.substr(1).toLowerCase();
				symbol['$'] = style;
			}
			
			var color;
			
			var fillColor = '#000000';
			var fillOpacity = 1;
			
			if(fill) {
				color = false;
				switch(typeof fill) {
					
					case 'string':
						color = Color.of(fill);
						break;
						
					case 'object':
					case 'function':
						if(fill.isColor) color = fill;
						else if(fill.color) color = Color.of(fill.color);
						break;
				}
				
				if(color) {
					fillColor = color.hex;
					fillOpacity = color.alpha;
				}
			}
			
			$.extend(symbol, {
				fillColor: fillColor,
				fillOpacity: fillOpacity,
			});
			
			
			var strokeStyle = 'null';
			var strokeColor = '#000000';
			var strokeWidth = 1;
			var strokeOpacity = 1;
			
			if(stroke) {
				color = false;
				strokeStyle = 'solid';
				
				switch(typeof stroke) {
					
					case 'string':
						color = Color.of(stroke);
						strokeStyle = 'solid';
						break;
						
					case 'object':
					case 'function':
						if(stroke.isColor) color = stroke;
						else if(stroke.color) color = Color.of(stroke.color);
						
						if(stroke.width) strokeWidth = stroke.width;
						
						if(stroke.style) strokeStyle = stroke.style;
						break;
				}
				
				if(color) {
					strokeColor = color.hex;
					strokeOpacity = color.alpha;
				}
			}
			
			if(strokeStyle !== 'null') {
				$.extend(symbol, {
					strokeColor: strokeColor,
					strokeWeight: strokeWidth,
					strokeOpacity: strokeOpacity,
				});
			}
			
		})();
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return symbol;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			isMapSymbol: true,
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
		googleMaps = google.maps;
		
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