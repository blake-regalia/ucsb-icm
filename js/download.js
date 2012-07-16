(function() {
	var __func__ = 'Download';
	var framework = dojo;
	
	// keep track of the download status' with 32-bit integers
	var download_set = {
		__: {
			full: 0,
			status: 0,
			length: 0,
		},
	};
	
	var self = {
		downloads_ready: function(setName) {
			var set = download_set[setName];
			if(set.ready) {
				set.ready.apply(this, []);
			}
		},
	};
	
	var chain = function(setName) {
		return {
			ready: function(callback) {
				var set = download_set[setName];
				set.ready = callback;
				if(set.status === set.full) {
					self.downloads_ready(setName);
				}
			},
		};
	};
	
	var global = window[__func__] = function() {
		
		var setName = '__';
		var args = arguments;
		if(typeof arguments[0] === 'string') {
			setName = arguments[0];
			args = Array.cast(arguments).slice(1);
			if(!download_set[setName]) {
				download_set[setName] = {
					full: 0,
					status: 0,
				};
			}
		}
		
		var set = download_set[setName];
		
		var i = args.length;
		while(i--) {
			
			// reference to this xml-http-request objective
			var xhrd = args[i];
			
			console.log(i, args);
			
			// if a method wasn't specified
			if(!xhrd.$) {
				console.log(xhrd);
				return global.error('a framework function was not specified for the XML-HTTP-Request');
			}
			
			// keep track of this download
			set.full |= 1 << set.length;
			
			// reference the method, and remove it from the options object
			var fun = xhrd.$;
			xhrd.$ = undefined;
			
			// extend a default option
			var opt = $.extend({
				type: 'GET',
			}, xhrd);
			
			// package
			(function() {
				var power = this.power;
				var error = this.error;
				var success = this.success;
				
				// override options
				opt.error = function(e) {
					global.error(e);
					error.apply(this, arguments);
				};
				
				// [success / load]: depends on framework (jquery / dojo) respectively
				opt[framework==jQuery?'success':'load'] = function() {
					// perform callback
					success.apply(this, arguments);
					
					// OR this download status bit into place
					var bit = 1 << power;
					set.status |= bit;
					
					// if all the downloads are complete
					if(set.status === set.full) {
						self.downloads_ready(setName);
					}
				};
			}).apply({
				power: set.length++,
				error: opt.error? opt.error: $.noop,
				success: opt.success? opt.success: $.noop,
			});
			
			// framework dependent ajax call
			if(framework == dojo) {
				dojo['xhr'+opt.type[0].toUpperCase()+opt.substr(1).toLowerCase()].apply(dojo, [opt]);
			}
			else if(framework == jQuery) {
				jQuery[fun].apply(jQuery, [opt]);
			}
		}
		
		return chain(setName);
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		
		
		error: function(msg) {
			console.error(__func__+': ',msg);
		},
		
		
		
		json: function(obj) {
			
			if(!obj.urls) {
				return global.error(Error.param('urls', global.json));
			}
			
			
			/*********/
			/*** needs to be optimized!!! very inefficient ***/
			/*********/
			var invalidChars = /[#\\:>]/;
			for(var e in obj.urls) {
				var url = obj.urls[e].split('');
				var i = url.length;
				while(i--) {
					if(invalidChars.test(url[i])) {
						url[i] = '%25'+encodeURIComponent(url[i]).substr(1);
					}
				}
				obj.urls[e] = url.join('');
			}
			
			for(var downloadId in obj.urls) {
				var opt = {
					url: obj.urls[downloadId],
					handleAs: 'json',
					error: function(e) {
						global.error(e);
					},
				};
				
				(function() {
					var id = this.id;
					opt.load = function(json) {
						obj.each.apply(obj, [id, json]);
					};
				}).apply({id:downloadId});
				
				dojo.xhrGet(opt);
			}
		},
	});
})();
