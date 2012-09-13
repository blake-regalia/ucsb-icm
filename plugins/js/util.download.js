(function() {
	var __func__ = 'Download';
	
	var noop = function(){};
	
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
			
			// keep track of this download
			set.full |= 1 << set.length;
			
			// extend a default option
			var opt = $.extend({
				type: 'GET',
			}, xhrd);
			
			// package
			(function() {
				var power = this.power;
				var error = this.error;
				var load = this.load;
				
				// override options
				opt['error'] = function(e) {
					global.error(e);
					error.apply(this, arguments);
				};
				
				opt['succes'] = function() {
					// perform callback
					load.apply(this, arguments);
					
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
				error: opt.error? opt.error: noop,
				load: opt.load? opt.load: noop,
			});
			
			var fun = 'ajax';
			if(opt.type == 'POST') fun = 'ajax';
			jQuery[fun].apply(dojo, [opt]);
		}
		
		return chain(setName);
	};
	
	
	$.extend(global, {
		
		
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
		
		jsonPost: function(url, data, fn) {
			$.post(url, data, fn, 'json');
		},
		
		json: function(obj, scn) {
			
			if(typeof obj === 'string' && typeof scn === 'function') {
				var url = obj;
				url = url.replace(/#/g,'%2523');
				url = url.replace(/:/g,'%253A');
				url = url.replace(/</g,'%253C');
				url = url.replace(/>/g,'%253E');
				url = url.replace(/\\/g,'ü');
				
				var opt = {
					'url': url,
					'dataType': 'json',
					'error': function(e) {
						//global.error('Could not parse JSON from response: "',url,'"');
						global.error(e);
					},
					'success': function(json) {
						if(json['error']) {
							global.warn('error response from: ["',this.url,'"]');
							global.error(json['error']);
						}
						else if(json['data']) {
							scn.apply(url,[json['data']]);
						}
						else {
							scn.apply(url,[json]);
						}
					},
				};
				return jQuery['ajax'](opt);
			}
			
			if(!obj.urls) {
				return global.error(Error.param('urls', global.json));
			}
			
			var dll = 0;
			var obj_urls = obj.urls;
			for(var e in obj_urls) {
				dll += 1;
				var url = obj_urls[e];
				url = url.replace(/%/g,'%2525');
				url = url.replace(/#/g,'%2523');
				url = url.replace(/:/g,'%253A');
				url = url.replace(/</g,'%253C');
				url = url.replace(/>/g,'%253E');
				obj_urls[e] = url;
			}
			
			var dlc = 0;
			for(var downloadId in obj.urls) {
				var opt = {
					'url': obj.urls[downloadId],
					'dataType': 'json',
					'error': function(e) {
						//global.error('Could not parse JSON from response: ',downloadId,' ["',this.url,'"]');
						global.error(e);
					},
				};
				
				(function() {
					var id = this.id;
					opt['success'] = function(json) {
						if(json['error']) {
							global.warn('error response from: ',id,' ["',this.url,'"]');
							global.error(json['error']);
						}
						else if(json['data']) {
							obj.each.apply(obj, [id, json['data']]);
							dlc += 1;
							if(dll === dlc && obj.ready) {
								obj.ready.apply(obj, [dlc]);
							}
						}
						else {
							obj.each.apply(obj, [id, json]);
							dlc += 1;
							if(dll === dlc && obj.ready) {
								obj.ready.apply(obj, [dlc]);
							}
						}
					};
				}).apply({id:downloadId});
				
				jQuery['ajax'](opt);
			}
		},
	});
})();
