(function() {
	
	var __func__ = 'ProgressIndicator';
	
	var container;
	
	var className = 'progress-indicator';
	
	var construct = function(ns) {
		
		/**
		* private:
		**/
		
		/**
		* protected:
		**/
		var self = {
			dom: $('<div class="'+className+'">'
					+'<div class="'+className+'-title">'+ns+'</div>'
					+'<div class="'+className+'-bar-container">'
						+'<div class="'+className+'-bar-width"></div>'
					+'</div>'
				+'</div>').appendTo(container).get(0),
		};
		
		var progressBar = $(self.dom).find('.'+className+'-bar-width').get(0);
		
		/**
		* public operator() ();
		**/
		
		var pm = 0;
		
		var operator = function(evt, p) {
			if(p > pm) {
				$(progressBar).width((p*100)+'%');
				pm = p;
			}
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			complete: function() {
				$(self.dom).remove();
			},
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
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