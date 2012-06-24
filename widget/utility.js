RegExp.EMAIL = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,4})$/i;
RegExp.NAMESPACE = /^([a-z_][a-z0-9_]*)(?:\.[a-z_][a-z0-9_]*)*$/;



(function() {
	var __func__ = 'Database';
	
	var namespace = {};
	
	var digestNamespace = function(namespaceFormat, into, index) {
		var names = namespaceFormat.split('.');
		var len = names.length;
		
		var node = into;
		for(var i=0; i<len; i++) {
			var ref = names[i];
			node[ref] = {
				$: index,
			};
			node = node[ref];
		}
		node.$ = index + 1;
		return node;
	};
	
	var parseNamespace = function(namespaceFormat, from) {
		var names = namespaceFormat.split('.');
		var len = names.length;
		
		var node = from;
		for(var i=0; i<len; i++) {
			var ref = names[i];
			node = node[ref];
		}
		return node;
	};
	
	var construct = function(address) {
		
		var my = {};
		
		
		var self = {
			
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			$: {},
			
			getPackageName: function() {
				return my.packageName;
			},
			
			toString: function() {
				return public.$db;
			},
		});
		
		var namespaceFormat;
		
		var match;
		if((match=RegExp.EMAIL.exec(address)) != undefined) {
			var domain = match[2].split('.');
			var i = domain.length;
			var b = [];
			while(i--) {
				b.push(domain[i]);
			}
			var user = match[1].replace(/[.%+-]/, '_');
			address = (b.join('.')+'.'+user).toLowerCase();
		}
		
		if(RegExp.NAMESPACE.test(address)) {
			var db = digestNamespace(address, namespace, 0);
			my.packageName = db.$db = address;
		}
		else {
			global.error('address ',address,' does not conform to the namespace convention');
			return;
		}
		
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		
		claimNamespace: function(namespace, string) {
			
		},
		
		toString: function() {
			return __func__+'()';
		},
	});
})();
