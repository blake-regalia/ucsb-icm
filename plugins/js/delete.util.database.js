(function() {
	
	var __func__ = 'Database';
	
	
	var instance;
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
		});
		
		
		return public;
		
	};
	
	
	var tool = {
		
		parse: function(udn) {
			
			var set = {};
			var dbt, match, name, domain;
			var slash = udn.indexOf('/');
			
			udn = udn.toLowerCase();
			
			// database
			if(slash === -1) {
			}
			
			// table
			else {
				
				var dbt = udn.substr(0, slash);
				var det = udn.substr(slash+1);
				
				// email format
				if(dbt.indexOf('@') !== -1) {
					if((match=/^([a-z0-9._%+-]+)@([a-z0-9.-]+)\.([a-z]{2,4})$/.exec(dbt)) != null) {
						name = [match[match.length-1]];
						domain = match[2].split('.');
						var i = domain.length;
						while(i--) name.push(domain[i]);
						name.push(match[1]);
						
						set.db = name.join('.');
					}
					else {
						return global.error('not valid email for database');
					}
				}
				else {
					set.db = dbt;
				}
				
				if((match=/[^a-z0-9._-]/.exec(det)) != null) {
					set.table = det.substr(0, match.index);
					set.query = det.substr(match.index);
				}
				else {
					set.table = det;
				}
			}
			
			return set;
		},
	};
	
	
	var typeString = 'string';
	var typeObject = 'object';
	
	var global = window[__func__] = function(db) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			if(typeof db === typeString) {
				if(db[0] === '/') {
					if(context) {
						return chain({udn:context+db});
					}
					else {
						
					}
				}
				else {
					
				}
			}
			else {
				
			}
		}
	};
	
	
	var offline = {};
	var metadata = {};
	var context = false;
	
	var argResolver_get = new ArgumentResolver(
		'[string udn], [function:isQuery query], function callback'
	);
	
	var argResolver_query = new ArgumentResolver(
		'string key, value',
		'object set'
	);
	
	$.extend(global, {
		
		setContext: function(db) {
			context = db;
		},
		
		get: function() {
			
			// resolve the given arguments
			var arg = argResolver_get(arguments);
			var udn = arg.udn;
			var query = arg.query;
			var callback = arg.callback;
			
			if(!query && offline[udn]) {
				return callback.apply({}, [offline[udn]]);
			}
			
			udn += query.toString();
			if(offline[udn]) {
				return callback.apply({}, [offline[udn]]);
			}
			
			console.log(udn);
			return;
			
			var set = tool.parse(udn);
			
			opt = opt || {};
			
			metadata[udn] = {
				subscribers: [],
			};
			offline[udn] = {};
			
			set = $.extend({
				db: '',
				table: '',
				query: '',
			}, set);
			
			$.getJSON('json.database.php?db='+set.db+'&table='+set.table+'&query='+set.query, function(json) {
				offline[udn] = json;
				if(opt.ready) opt.ready.apply(opt.ready, []);
				
				var subscribers = metadata[udn].subscribers;
				var i = subscribers.length;
				while(i--) {
					subscribers[i].apply(subscribers[i], []);
				}
			});
			
			if(opt.every) {
				metadata[udn].interval = window.setInterval(function() {
					global.download(udn);
				}, opt.every)
			}
		},
		
		subscribe: function(udn, tome) {
			if(metadata[udn]) {
				metadata[udn].subscribers.push(tome);
			}
		},
		
		unsubscribeAll: function(udn) {
			if(metadata[udn]) {
				metadata[udn].subscribers.length = 0;
			}
		},
		
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



