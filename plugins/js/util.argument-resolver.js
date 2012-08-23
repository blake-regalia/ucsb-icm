
/**

One of the following keywords must prefix every argument name in the resolver syntax
-------------------------------------------

1	boolean
2	number
4	string
8	object
16	function

32		array
64		array-string
128		array-number
256		string-int
512		string-float
1024	object:TYPE
2048	function:TYPE


Syntax Delimeters:
----------------------
optional: []
separate: ,
accept-undefined: ?


Examples:
----------------------
[boolean useGps], string name, object|function animal

[
	{
		type: 1,
		name: 'useGps',
		reqd: false,
	},
	{
		type: 4,
		name: 'name',
		reqd: true,
	},
	{
		type: 24,
		name: 'animal',
		reqd: true,
	},
]

string key, value?
 => first argument must be string, second argument can be undefined but do not skip it if it is

 
 
[number deep], number high, [string h]
(5, 'great') => {deep:undefined, high:5, h:'great'}
(2,5) => {deep:2, high:5}

**/



(function() {
	
	var __func__ = 'ArgumentResolver';
	
	
	/**
	* private map[string->bitmask] bitmask
	**/
	var bitmask = {},
		bitmaskAll,
		bitmaskArray,
		bitmaskString,
		bitmaskObject;
	(function() {
		
		var bitmaskList = 'boolean/number/string/object/function/array/array-string/array-number/array-int/array-float/string-int/string-float'.split('/');
		var key = 1;
		for(var i=0; i<bitmaskList.length; i++) {
			bitmask[bitmaskList[i]] = key;
			key <<= 1;
		}
		
		bitmaskAll = key - 1;
		
		bitmaskArray = bitmask['array'];
		bitmaskString = bitmask['string'];
		bitmaskObject = bitmask['object'];
		
		bitmask['array-int']    |= bitmaskArray;
		bitmask['array-float']  |= bitmaskArray;
		bitmask['array-number'] |= bitmaskArray;
		bitmask['array-string'] |= bitmaskArray;
		bitmask['string-int']   |= bitmaskString;
		bitmask['string-float'] |= bitmaskString;
		bitmask['function']     |= bitmaskObject;
	})();
	
	
	/**
	* private map[bitmask->string] bitmaskLookup
	**/
	var bitmaskLookup = {};
	(function() {
		for(var e in bitmask) {
			bitmaskLookup[bitmask[e]] = e;
		}
	})();
	
	
	/**
	* private class ArgumentInterpretter
	**/
	var ArgumentInterpretter;
	
	(function() {
		var __func__ = 'ArgumentInterpretter';
		
		/**
		* private regexp argSyntaxRegex
		**/
		var argSyntaxRegex = /^(\[)?\s*(?:([a-z][a-z\-]*(?:\:[a-z][a-z0-9]*)?(?:\|[a-z][a-z\-]*(?:\:[a-z][a-z0-9]*)?)*)\s+)?([a-z][a-z0-9]*)(\??)(\])?$/i;
		
		var construct = function(argstr) {
			
			var criteria = {};
			var numReqd = 0;
			
			var self = {
				
				interpret: function(ars) {
					
					// trim whitespace
					ars = ars.replace(/^\s+/,'').replace(/\s+$/,'');
					
					var list = [],
						sets = ars.split(/\s*,\s*/),
						meta, match, ors, mst;
					
					// for each argument..
					var i = sets.length;
					while(i--) {
						
						// if this set matches the regex..
						if((match=argSyntaxRegex.exec(sets[i])) !== null) {
							
							meta = {
								// is this argument required
								reqd: (match[1] === match[5]),
								
								// should this argument have a specific property
								prop: [],
								
								// name of argument to use when calling back
								name: match[3],
								
								// can this argument be undefined yet required
								udef: !!match[4].length && meta.reqd,
								
								// type(s) argument conforms to
								type: 0,
							};
							
							if(!match[2]) {
								meta.type = bitmaskAll;
							}
							else {
								// bitwise or any applicable types
								ors = match[2].split('|');
								var j = ors.length;
								while(j--) {
									mst = ors[j].split(':');
									// push property if this def has one
									if(mst[1]) meta.prop.push(mst[1]);
									mst = mst[0];
									if(!bitmask[mst]) return console.error('type ',mst,' not defined');
									meta.type |= bitmask[mst];
								}
							}
							
							// keep track of cummulative properties
							if(meta.reqd) numReqd += 1;
							
							// add it to the list
							list.push(meta);
						}
					}
					return list;
				},
			};
			
			var public = function() {
				
			};
			
			$.extend(public, {
				
				accepts: function(argTypes) {
					
					var argList = [];
					
					var x = criteria.length;
					
					// if the number args given...
					var i = argTypes.length;
					
					// is less than the number required, don't accept it
					if(i < numReqd) {
						return false;
					}
					
					// is the same as expected, only compare against required args
					else if(i == numReqd) {
						while(x--) {
							var argTmp = criteria[x];
							// for the required args, if the candidate arg-type is not allowed, don't accept
							if(argTmp.reqd) {
								if(!(argTypes[--i] & argTmp.type)) {
									return false;
								}
								argList.push(argTmp);
							}
						}
						return argList;
					}
					
					// is more than required but less than or equal to max allowed
					else if(i <= x) {
						
						// set the argTypes iterater to the max index
						i -= 1;
						
						// while both indicies are valid range
						while(x-- && i >= 0) {
							var argTmp = criteria[x];
							
							// for the required args, if the candidate arg-type is not allowed, don't accept
							if(argTmp.reqd) {
								if(!(argTypes[i--] & argTmp.type)) {
									return false;
								}
								argList.push(argTmp);
							}
							// if the arg is not required, try to accept it
							else if(argTypes[i] & argTmp.type) {
								argList.push(argTmp);
								i -= 1;
							}
						}
						if(i !== -1) {
							return false;
						}
						return argList;
					}
					
					return false;
				},
			});
			
			criteria = self.interpret(argstr);
			
			return public;
		};
		var global = ArgumentInterpretter = function() {
			if(this !== window) {
				var instance = construct.apply(this, arguments);
				return instance;
			}
			else {
				
			}
		};
		$.extend(global, {
			toString: function() {
				return __func__+'()';
			}
		});
	})();
	
		
	
		var typeBoolean  = 'boolean';
		var typeNumber   = 'number';
		var typeString   = 'string';
		var typeObject   = 'object';
		var typeFunction = 'function';
		var typeArray    = 'array';
		
	
	/**
	* public ArgumentResolver(string argumentSyntax[...])
	**/
	var construct = function() {
		
		var argOpts = [];
		
		var i = arguments.length;
		while(i--) {
			argOpts.push(
				new ArgumentInterpretter(arguments[i])
			);
		}
		
		var argOptsLen = argOpts.length;
		
		
		var public = function(args) {
			
			var b = {};
			var i, a, t;
			
			var argLen = args.length;
			
			var argTypes = [];
			i = argLen;
			while(i--) {
				a = args[i];
				t = bitmask[typeof a];
				if(a instanceof Array) t |= bitmaskArray;
				argTypes.push(t);
			}
			
			i = argOpts.length;
			while(i--) {
				var argList = argOpts[i].accepts(argTypes);
				if(argList !== false) {
					var reject = false;
					var obj = {};
					for(var j=0; j<argLen; j++ && !reject) {
						var argInfo = argList[j];
						var aname = argInfo.name;
						var value = args[j];
						switch(bitmaskLookup[argInfo.type]) {
							
							case 'string-int':
								obj[aname] = parseInt(value);
								break;
								
							case 'string-float':
								obj[aname] = parseFloat(value);
								break;
								
							case 'array-int':
								var k = value.length;
								while(k--) value[k] = parseInt(value[k]);
								break;
								
							case 'array-float':
								var k = value.length;
								while(k--) value[k] = parseFloat(value[k]);
								break;
								
							case 'array':
							case 'object':
							case 'function':
								var prop = argInfo.prop;
								var p = prop.length;
								
								console.log(prop, value);
								if(p) {
									reject = true;
									while(p--) {
										if(value[prop[p]]) {
											reject = false;
											break;
										}
									}
									if(!reject) {
										obj[aname] = value;
									}
								}
								else {
									obj[aname] = value;
								}
								break;
								
							default:
								obj[aname] = value;
								break;
						}
					}
					if(reject) continue;
					return obj;
				}
			}
			
			return global.error('interpretters did not accept your args');
		};
		
		
		$.extend(public, {
			
		});
		
		
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