/**

query('ssid','blake').and('bssid','quant')

s != X && s != Y	query.not(s,X).not(s,Y)
s == X || s == Y	query.or(s,X).or(s,Y)
s == X && d != F	query(s,X).not(d,F)
s != X || d != Y	query.not( query.or({s:X, d:Y}) )


Q(
	Q('first','like','blake%').and('last','=','regalia')
)
.or(
	Q('first','bruce').and('last','!=','wayne')
);


Q(
	Q('first','like','blake%').and('last','=','regalia'),
		'or',
	Q('first','bruce').and('last','!=','wayne')
);

@(`first`like'blake%',`last`='regalia'^`first`='bruce',`last`='wayne')



**/
(function() {
	
	var __func__ = 'Query';
	
	
	
	var construct = function() {
		
		var ops = {};
		
		var self = {
			
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
			isQuery: true,
			
			addOp: function(f, k, v) {
				if(!ops[f]) ops[f] = [];
				var tmp = {};
				tmp[k] = v;
				ops[f].push(tmp);
				console.log(ops);
			},
			
			toString: function() {
				var b = '';
				for(var e in ops) {
					b += e+'(';
					var set = ops[e];
					var i = set.length;
					var c = [];
					while(i--) {
						var x = set[i];
						var d = [];
						for(var xe in x) {
							d.push("`"+xe+"`='"+x[xe]+"'");
						}
						c.push(d.join(','));
					}
					b += c.join(',');
				}
				b += ')';
				return b;
			},
		});
		
		
		return public;
		
	};
	
	
	argResolver_operator = new ArgumentResolver(
		'string key, [string oper], value',
		'object set'
	);
	
	var exec = function(op, symbol, obj, argList) {
		var arg = argResolver_operator(argList);
		
		if(arg.set) {
			var set = arg.set;
			for(var e in set) {
				
				var x = set[e];
				if(x instanceof Array) {
					var xi = x.length;
					while(xi--) {
						obj[op](symbol, e, x[xi]);
					}
				}
				else {
					obj[op](symbol, e, x);
				}
			}
		}
		else {
			var x = arg.value;
			if(x instanceof Array) {
				var xi = x.length;
				while(xi--) {
					obj[op](symbol, arg.key, x[xi]);
				}
			}
			else {
				obj[op](symbol, arg.key, x);
			}
		}
		
		return chain(obj);
	};
	
	
	var primitive = function(symbol, obj, argList) {
		var arg = argResolver_operator(argList);
		
		if(arg.set) {
			var set = arg.set;
			for(var e in set) {
				
				var x = set[e];
				if(x instanceof Array) {
					var xi = x.length;
					while(xi--) {
						obj.addOp(symbol, e, x[xi]);
					}
				}
				else {
					obj.addOp(symbol, e, x);
				}
			}
		}
		else {
			var x = arg.value;
			if(x instanceof Array) {
				var xi = x.length;
				while(xi--) {
					obj.addOp(symbol, arg.key, x[xi]);
				}
			}
			else {
				obj.addOp(symbol, arg.key, x);
			}
		}
		
		return chain(obj);
	};
	
	
	var addOp  = 'addOp';
	var addCmp = 'addCmp';
	
	var and = function() {
		return exec(addOp, '@', this, arguments);
	};
	
	var or = function() {
		return exec(addOp, '|', this, arguments);
	};
	
	var length = function() {
		return primitive('_', this, arguments);
	};
	
	
	var comparitive = function(symbol, obj, argList) {
		return exec('addCmp',symbol,obj,argList);
	}
	
	var not = function() {
		return comparative('!=', this, arguments);
	};
	
	var like = function() {
		return comparative('like', this, arguments);
	};
	
	
	
	
	var sum = function() {
		return primitive('+', this, arguments);
	};
	
	
	var chain = function(obj) {
		return {
			and: function() {
				return and.apply(obj, arguments);
			},
			or: function() {
				return or.apply(obj, arguments);
			},
			sum: function() {
				return sum.apply(obj, arguments);
			},
			toString: function() {
				return obj.toString();
			},
		};
	};
	
	
	var global = window[__func__] = function() {
		return and.apply(construct(), arguments);
	};
	
	
	
	$.extend(global, {
		
		and: function() {
			return and.apply(construct(), arguments);
		},
		
		or: function() {
			return or.apply(construct(), arguments);
		},
		
		sum: function() {
			return sum.apply(construct(), arguments);
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