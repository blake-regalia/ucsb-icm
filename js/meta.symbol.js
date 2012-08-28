(function() {
	
	var __func__ = 'Symbol';
	
	var SIMPLE = {
		'solid': 'STYLE_SOLID',
		'dot': 'STYLE_DOT',
		'dash': 'STYLE_DASH',
		'dashdot': 'STYLE_DASHDOT',
		'dashdotdot': 'STYLE_DASHDOTDOT',
		'null': 'STYLE_NULL',
	};
	
	var esri_symbol = esri.symbol;
	var esri_simpleFill = esri_symbol.SimpleFillSymbol;
	var esri_simpleLine = esri_symbol.SimpleLineSymbol;
	
	
	
	var resolveColorStr = function(str) {
		var x;
		if((x=/^rgb(a?)\((\d+),(\d+),(\d+),?([0-9\.]+)?\)$/.exec(str)) !== null) {
			if(x[1].length) {
				return new dojo.Color([parseInt(x[2]), parseInt(x[3]), parseInt(x[4]), parseFloat(x[5])]);
			}
			return new dojo.Color([parseInt(x[2]), parseInt(x[3]), parseInt(x[4])]);
		}
	};
	
	var construct = function(obj) {
		
		/**
		* private:
		**/
		var symbol;
		
		(function() {
			var style  = obj.style;
			var fill   = obj.fill;
			var stroke = obj.stroke;
			
			if(style) {
				if(SIMPLE[style]) {
					style = esri_simpleFill[SIMPLE[style]];
				}
			}
			
			
			var fillStyle = 'solid';
			var fillColor = new dojo.Color(0,0,0);
			
			if(fill) {
				
				switch(typeof fill) {
					
					case 'string':
						var fillColor = resolveColorStr(fill);
						break;
						
					case 'object':
						if(fill.style) fillStyle = fill.style;
						if(fill.color) fillColor = resolveColorStr(fill.color);
						break;
				}
				fillStyle = esri_simpleFill[SIMPLE[fillStyle]];
			}
			
			
			var outlineStyle = 'null';
			var outlineColor = new dojo.Color([0,0,0]);
			var outlineWidth = 1;
			
			if(stroke) {
				outlineStyle = 'solid';
				
				switch(typeof stroke) {
					
					case 'string':
						var outlineColor = resolveColorStr(stroke);
						break;
						
					case 'object':
						if(stroke.style) outlineStyle = stroke.style;
						if(stroke.color) outlineColor = resolveColorStr(stroke.color);
						if(stroke.width) outlineWidth = stroke.width;
						break;
				}
				outlineStyle = esri_simpleLine[SIMPLE[outlineStyle]];
			}
			
			
			symbol = new esri_simpleFill(
				fillStyle,
				new esri_simpleLine(
					outlineStyle,
					outlineColor,
					outlineWidth
				),
				fillColor
			);
			
		})();
		
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var public = function() {
			return symbol;
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
			//
			isMetaSymbol: true,
			
			//
			declaredClass: true,
		});
		
		
		return public;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
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