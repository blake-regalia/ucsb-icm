/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	
	var __func__ = 'CSS';
	
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var operator = function() {
		};
		
		
		$.extend(operator, {
			
		});
		
		
		return operator;
		
	};
	
	
	var PT = {
		'6':    8,
		'7':    9,
		'7.5':  10,
		'8':    11,
		'9':    12,
		'10':   13,
		'10.5': 14,
		'11':   15,
		'12':   16,
		'13':   17,
		'13.5': 18,
		'14':   19,
		'14.5': 20,
		'15':   21,
		'16':   22,
		'17':   23,
		'18':   24,
		'20':   26,
		'22':   29,
		'24':   32,
		'26':   35,
		'27':   36,
		'28':   37,
		'29':   38,
		'30':   40,
		'32':   42,
		'34':   45,
		'36':   48,
	};
	
	
	var convertPtPx = function(pt) {
		if(PT[pt]) return PT[pt];
		
		var under = Math.floor(pt);
		while(under > 0 && !PT[under]) {
			under -= 0.5;
		}
		
		var over = Math.ceil(pt);
		while(over < 200 && !PT[over]) {
			over += 0.5;
		}
		
		if(!PT[under]) return report.error('number too low for conversion: ',pt);
		if(!PT[over]) return report.error('number too high for conversion: ',pt);
		
		var low = PT[under];
		var high = PT[over];
		
		return (((pt - under) / (over - under)) * (high - low)) + low;
	};
	
	
	
	var resolveTarget = function(str) {
		
		// start with the parent node
		var node = global;
		
		// split the string by namespace separator
		var terms = str.split('.');
		
		// iterate over the terms
		for(var i=0; i<terms.length; i++) {
			
			var term = terms[i];
			
			// check the node exists
			if(!node[term]) {
				report.error(term,' was not found in "',node,'", from "',str,'"');
				return false;
			}
			// else advance the poiner
			else {
				node = node[term];
			}
		}
		
		return node;
	};
	
	
	var aValue = function(node) {
		
		var match;
		
		if(match = /^(\-?[0-9.]+)([^ ]+)( !important|)$/.exec(node)) {
			
			var value = parseFloat(match[1]);
			var unit = match[2];
			
			return {
				
				pixels: function(wrt) {
					switch(unit) {
						case '%': return (value / 100)*wrt;
						case 'px': return value;
						case 'pt': return convertPtPx(value);
					}
					return value;
				},
				
				toString: function() {
					return node;
				},
			};
		}
	};
	
	
	
	var get = function() {
		
		var node = null;
		
		if(arguments.length == 1) {
			
			var arg = arguments[0];
			
			switch(typeof arg) {
				case 'string':
					node = resolveTarget(arg);
					break;
			}
		}
		
		if(node === null) return {};
		
		if(typeof node === 'string') {
			return aValue(node);
		}
		else {
			return node;
		}
	};
	
	
	
	var report = {
		
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
	};
	
	
	
	
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return get.apply(this, arguments);
		}
	};
	
	
	
	$.extend(global, {
		
		//
		toString: function() {
			return __func__+'()';
		},
	});
})();