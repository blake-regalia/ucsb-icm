var djConfig = {
	parseOnLoad: true
};
// Benchmark
(function() {
	var date = Date;
	var now = function() {
		return (new date()).getTime();
	};
	
	var event = {};
	var order = [];
	
	var fancy = false;
	var online = false;
	var localhostOnline = false;
	
	var time_form = 'ms';
	var format = function(time) {
		if(isNaN(time)) return time;
		var str = false;
		switch(time_form) {
			case 'ms':
				str = time+'ms';
				break
			case 's':
				str = (time/1000)+'s';
		}
		if(str === false) return str;
		if(fancy) {
			var p = function(){};
			p.toString = function(){return str;};
			return p;
		}
		return str;
	};
	
	var log_file = [];
	var save_log = function() {
		if(console && console.info) console.info.apply(console, arguments);
		if(online) {
			var tmp = '';
			for(var i=0; i!==arguments.length; i++) {
				tmp += arguments[i];
			}
			log_file.push(tmp);
		}
	}
	
	var global = window['Benchmark'] = {
		start: function(key) {
			if(event[key]) {
				delete event[key];
			}
			event[key] = {
				start: now(),
				marks: [],
			};
		},
		stop: function(key, action) {
			if(arguments.length < 2) action = 'complete';
			var bench = event[key];
			if(bench) {
				bench.stop = {
					time: now(),
					action: action,
				};
				var ms = bench.stop.time-bench.start;
				save_log(key,' took ',format(ms),' to ',action);
				return ms;
			}
		},
		mark: function(what, since) {
			var bench = event[since];
			if(bench) {
				var mark = now()-bench.start;
				bench.marks.push({
					after: mark,
					what: what,
					
				});
				save_log(what,' took ',format(mark),' since ',since,' started');
			}
		},
		save: function(as) {
			if(!online) return;
			
			var framework_xhr_method = false;
			if(typeof dojo !== 'undefined' && dojo) {
				framework_xhr_get_method = function(o) {
					dojo['xhrGet'](o);
				};
			}
			
			if(framework_xhr_get_method) {
				var log = (new Date()).toString()+'\n'+log_file.join('\n');
				var urlstr = 'benchmark.php?save='+as+'&log='+encodeURIComponent(log);
				framework_xhr_get_method({
					url: urlstr,
				});
			}
			log_file.length = 0;
		},
		toString: function() {
			return 'Benchmark()';
		},
		setFormat: function(time_format) {
			switch(time_format.toLowerCase()) {
				case 's': time_form = 's'; break;
				case 'ms': time_form = 'ms'; break;
			}
		},
		setFancy: function(bool) {
			fancy = !!bool;
		},
		highlight: function(text) {
			var p = function(){};
			p.toString = function(){return text;};
			return p;
		},
	};
	
	Benchmark.setFancy(true);
	Benchmark.setFormat('ms');
	Benchmark.start('all scripts');
	
	if(window.location.host !== '') {
		if(localhostOnline || window.location.host !== 'localhost') {
			online = true;
		}
	}
})();
/************************
** kit.unra.js
************************/
Benchmark.start('kit.unra.js');

 /** ****************************************** **/
 /**** Underlying Natural Resource Algorithms ****/
 /** ****************************************** **/
 /** *      Blake Regalia        * **/
 /** * <blake.regalia@gmail.com> * **/
 /** ***************************** **/
 
 
/** ********************* **/
/** ******  STRING  ***** **/
/** ********************* **/
String.empty = '';
String.type = 'string';
Number.type = 'number';
Object.type = 'object';
Boolean.type = 'boolean';
Function.type = 'function';
Undefined = {
	type: 'undefined',
};

String.prototype.substr = function(a, b) {
	var empty = '';
	var length = this.length;
	if(b === 0) return empty;
	var chr = this.split(empty), str = empty;
	if(a < 0) a += length;
	if(!b) b = length;
	if(b < 0) b += length - a;
	for(var i=a; i<a+b; i++) {
		if(!chr[i]) break;
		str += chr[i];
	}
	return str;
};

String.splitNoEmpty = function(str, delim) {
	var a = -1, i = 0, p = [], tmp;
	while((i = str.indexOf(delim, a+1)) !== -1) {
		tmp = str.substr(a+1, i-a-1);
		if(tmp.length) p.push(tmp);
		a = i;
	}
	tmp = str.substr(a+1);
	if(tmp.length) p.push(tmp);
	return p;
};

String.fill = function(pad, str) {
	str = str+'';
	return pad.substr(str.length)+str;
};


/** ******************** **/
/** *****  ARRAY  ***** **/
/** ******************** **/
Array.isArray = function(object) {
	return (typeof object === "array");
};
Array.cast = function(object) {
	return Array.prototype.slice.call(object);
};
Array.prototype.str = function() {
	if(!arguments.length) return this.join('');
	this.push(Array.prototype.slice.call(arguments).join(''));
	return this;
};

Array.swap = function(a, b) {
	var tmp = this[a];
	this[a] = this[b];
	this[b] = tmp;
};

DOM_Event = {
	noBubble: function(e) {
		e.stopPropagation();
	},
};


/** ******************* **/
/** *****  OBJECT ***** **/
/** ******************* **/

/* taken from jQuery */
Object.isPlainObject = function( obj ) {
	var hasOwn = Object.prototype.hasOwnProperty;
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || typeof obj !== "object" || obj.nodeType || obj === window ) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};

Object.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
	target = arguments[0] || {},
	i = 1,
	length = arguments.length,
	deep = false;

	// Handle a deep copy situation
	if(typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if(typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if(length === i) {
		target = this;
		--i;
	}

	for(; i<length; i++) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( Object.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && Object.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = Object.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};




// ported from jQuery
Object.css = (function() {
	var 
	
	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,
	
	curCSS = function() {
		alert('unable to fetch css value from Object function: not implemented');
	},
	
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks = {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},
	
	// Exclude the following css properties to add px
	cssNumber = {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	
	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps = {
		// normalize float css property
		"float": false ? "cssFloat" : "styleFloat"
	},
	
	// Used by camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},
	
	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase = function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	getComputedStyle,
	currentStyle;
	
	
	var self = {
		
		
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, origName = camelCase( name ),
				style = elem.style, hooks = cssHooks[ origName ];
	
			name = cssProps[ origName ] || origName;
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// convert relative number strings (+= or -=) to relative numbers. #7345
				if ( type === "string" && (ret = rrelNum.exec( value )) ) {
					value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( curCSS( elem, name ) );
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that NaN and null values aren't set. See: #7116
				if ( value == null || type === "number" && isNaN( value ) ) {
					return;
				}
	
				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if ( type === "number" && !cssNumber[ origName ] ) {
					value += "px";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
					// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
					// Fixes bug #5509
					try {
						style[ name ] = value;
					} catch(e) {}
				}
	
			} else {
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra ) {
			var ret, hooks;
	
			// Make sure that we're working with the right name
			name = camelCase( name );
			hooks = cssHooks[ name ];
			name = cssProps[ name ] || name;
	
			// cssFloat needs a special treatment
			if ( name === "cssFloat" ) {
				name = "float";
			}
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
				return ret;
	
			// Otherwise, if a way to get the computed value exists, use that
			} else if ( curCSS ) {
				return curCSS( elem, name );
			}
		},
	
		// A method for quickly swapping in/out CSS properties to get correct calculations
		swap: function( elem, options, callback ) {
			var old = {},
				ret, name;
	
			// Remember the old values, and insert the new ones
			for ( name in options ) {
				old[ name ] = elem.style[ name ];
				elem.style[ name ] = options[ name ];
			}
	
			ret = callback.call( elem );
	
			// Revert the old values
			for ( name in options ) {
				elem.style[ name ] = old[ name ];
			}
	
			return ret;
		}
	};

	return self;
	
})();




window['$'] = window['jQuery']? window['jQuery']: {
	extend: Object.extend,
	style: Object.css.style,
	css: Object.css.css,
};



/** ********************* **/
/** *****  BOOLEAN  ***** **/
/** ********************* **/



/** ******************** **/
/** ****  FUNCTION  **** **/
/** ******************** **/
Function.noop = function(){};
Function.retrieve = {};
Function.memory = {};
Function.callback = function(key, method) {
	if(typeof method === Undefined.type) {
		return function(call) {
			if(Function.memory[key]) {
				var result = Function.memory[key];
				delete Function.memory[key];
				return call.apply(null, [result]);
			}
			else {
				return Function.retrieve[key] = call;
			}
		};
	}
	else {
		return function() {
			var result = method.apply(this, arguments);
			if(Function.retrieve[key]) {
				return Function.retrieve[key].apply(null, [result]);
			}
			else {
				return Function.memory[key] = result;
			}
		};
	}
};

Function.reflect = function(arg) {
	return arg;
};
Function.wrap = function(method, asthis) {
	return function() {
		method.apply(asthis, arguments);
	};
};



/** Function.listener
**/
(function() {
	var listener = {};
	
	var self = {
		
		complete_listener: function(id) {
			var extract;
			switch(typeof listener[id].data) {
				case Boolean.type:
				case Number.type:
				case String.type:
				case Undefined.type:
					extract = listener[id].data;
					break;
				default:
					extract = Object.extend(true, {}, listener[id].data);
					break;
			}
			delete listener[id].data;
			return extract;
		},
		
		get_listener: function() {
			var id = this.id;
			
			return function(callback) {
				
				console.log('id: ',id);
				// the data has been ready before the listener asked for it
				if(listener[id].data) {
					var extract = self.complete_listener(id);
					return listener[id].callback.apply(window, [extract]);
				}
				
				// the data is not ready yet
				listener[id].callback = callback;
			};
		},
		
		callback_listener: function() {
			var id = this.id;
			var black_box = this.black_box;
			
			return function() {
				console.log('id: ',id);
				
				var result;
				if(typeof black_box === 'function') {
					result = black_box.apply(this, arguments);
					
					// the result is ready, store it
					listener[id].data = result;
					
					// the listener is waiting for the result
					if(listener[id].callback) {
						var extract = self.complete_listener(id);
						return listener[id].callback.apply(window, [extract]);
					}
				}
				else {
					listener[id].callback.apply(this, arguments);
				}
			};
		},
	};
	
	var global = Function.listener = function(id) {
		// create an empty object for this identifier
		listener[id] = {
			data: false,
			callback: false,
		};
		
		return self.get_listener.apply({id:id});
	};
	
	global.prepare_callback = function(id, black_box) {
		return self.callback_listener.apply({id:id,black_box:black_box});
	};
})();


/** Timer **/
(function() {
	var construct = function(timeToLive) {
		var start = (new Date()).getTime();
		
		var public = function() {
			var elapsed = (new Date()).getTime() - start;
			if(elapsed >= timeToLive) public.expired = true;
			return elapsed;
		};
		Object.extend(public, {
			expired: false,
			toString: function() {
				return 'new Timer()';
			},
		});
		return public;
	};
	var global = window['Timer'] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	Object.extend(global, {
		toString: function() {
			return 'Timer()';
		},
	});
})();



/** ****************** **/
/** *****  MATH  ***** **/
/** ****************** **/
Math.degreesToRadians = Math.PI / 180;
Math.parseNumber = function(str, weight) {
	if(typeof str === Number.type) return str;
	if(typeof str === Undefined.type) return weight;
	if(typeof str !== String.type) {
		console.error(['Unable to parse number [',typeof str,']: '].str(),str);
		return 0;
	}
	var num = parseFloat(str);
	var res = /-?[0-9\.]+(%?|\/)?([0-9\.]+)?/.exec(str);
	if(res !== null) {
		switch(res[1]) {
			case '%':
				return (num/100)*weight;
			case '/':
				return weight*num/parseFloat(res[2]);
		}
	}
	if(isNaN(num)) return 0;
	return num;
};


/** ******************* **/
/** *****  ERROR  ***** **/
/** ******************* **/
Error.param = function(name, method) {
	return 'call to '+method.name+' function missing argument: `'+name+'`';
};


Date.Sunday    = 1;
Date.Monday    = 2;
Date.Tuesday   = 4;
Date.Wednesday = 8;
Date.Thursday  = 16;
Date.Friday    = 32;
Date.Saturday  = 64;


/** ******************* **/
/** *****  IMAGE  ***** **/
/** ******************* **/
Image.download = function(url, callback) {
	var image = new Image();
	image.onload = function() {
		callback.apply(image, [image]);
	};
	image.src = url;
};


Image.aspectFit = function(img, width, height) {
	
	var info = {
		x: 0, y: 0,
		w: img.naturalWidth,
		h: img.naturalHeight,
	};
	
	var viewAR = width/height;
	var imgAR = info.w / info.h;
	
	if(imgAR > viewAR) {
		info.w = width;
		info.h = info.w/imgAR;
		info.y = height/2 - info.h/2;
		info.aspect = 'width';
	}
	else {
		info.h = height;
		info.w = info.h*imgAR;
		info.x = width/2 - info.w/2;
		info.aspect = 'height';
	}
	
	return info;
};


/** 
DOM UPPER-case keys
**/
DOM_VK_KEY = {
	32: " ",
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	59: ":",
	65: "A",
	66: "B",
	67: "C",
	68: "D",
	69: "E",
	70: "F",
	71: "G",
	72: "H",
	73: "I",
	74: "J",
	75: "K",
	76: "L",
	77: "M",
	78: "N",
	79: "O",
	80: "P",
	81: "Q",
	82: "R",
	83: "S",
	84: "T",
	85: "U",
	86: "V",
	87: "W",
	88: "X",
	89: "Y",
	90: "Z",
	96: "0",
	97: "1",
	98: "2",
	99: "3",
	100: "4",
	101: "5",
	102: "6",
	103: "7",
	104: "8",
	105: "9",
	106: "*",
	107: "+",
	107: "=",
	108: "|",
	109: "-",
	110: ".",
	111: "/",
	188: "<",
	190: ">",
	191: "?",
	192: "~",
	219: "{",
	220: "|",
	221: "}",
	222: "\"",
	
	" ":32,
	")":48,
	"!":49,
	"@":50,
	"#":51,
	"$":52,
	"%":53,
	"^":54,
	"&":55,
	"*":56,
	"(":57,
	":":59,
	"A":65,
	"B":66,
	"C":67,
	"D":68,
	"E":69,
	"F":70,
	"G":71,
	"H":72,
	"I":73,
	"J":74,
	"K":75,
	"L":76,
	"M":77,
	"N":78,
	"O":79,
	"P":80,
	"Q":81,
	"R":82,
	"S":83,
	"T":84,
	"U":85,
	"V":86,
	"W":87,
	"X":88,
	"Y":89,
	"Z":90,
	"*":106,
	"+":107,
	"=":107,
	"|":108,
	"-":109,
	".":110,
	"<":188,
	">":190,
	"?":191,
	"~":192,
	"{":219,
	"|":220,
	"}":221,
	"\"":222,
};

/** 
DOM lower-case keys
**/
DOM_VK_key = {
	32: " ",
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	59: ";",
	65: "a",
	66: "b",
	67: "c",
	68: "d",
	69: "e",
	70: "f",
	71: "g",
	72: "h",
	73: "i",
	74: "j",
	75: "k",
	76: "l",
	77: "m",
	78: "n",
	79: "o",
	80: "p",
	81: "q",
	82: "r",
	83: "s",
	84: "t",
	85: "u",
	86: "v",
	87: "w",
	88: "x",
	89: "y",
	90: "z",
	96: "0",
	97: "1",
	98: "2",
	99: "3",
	100: "4",
	101: "5",
	102: "6",
	103: "7",
	104: "8",
	105: "9",
	106: "*",
	107: "+",
	107: "=",
	108: "|",
	109: "-",
	110: ".",
	111: "/",
	188: ",",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'",
	
	" ":32,
	".0":48,
	".1":49,
	".2":50,
	".3":51,
	".4":52,
	".5":53,
	".6":54,
	".7":55,
	".8":56,
	".9":57,
	";":59,
	"a":65,
	"b":66,
	"c":67,
	"d":68,
	"e":69,
	"f":70,
	"g":71,
	"h":72,
	"i":73,
	"j":74,
	"k":75,
	"l":76,
	"m":77,
	"n":78,
	"o":79,
	"p":80,
	"q":81,
	"r":82,
	"s":83,
	"t":84,
	"u":85,
	"v":86,
	"w":87,
	"x":88,
	"y":89,
	"z":90,
	"*":106,
	"+":107,
	"=":107,
	"|":108,
	"-":109,
	".":110,
	",":188,
	".":190,
	"/":191,
	"`":192,
	"[":219,
	"\\":220,
	"]":221,
	"'":222,
};

/** 
DOM
**/
DOM_VK = {
	3: "CANCEL",
	6: "HELP",
	8: "BACKSPACE",
	9: "TAB",
	12: "CLEAR",
	13: "RETURN",
	14: "ENTER",
	16: "SHIFT",
	17: "CONTROL",
	18: "ALT",
	19: "PAUSE",
	20: "CAPS_LOCK",
	27: "ESCAPE",
	32: "SPACE",
//	32: " ",
	33: "PAGE_UP",
	34: "PAGE_DOWN",
	35: "END",
	36: "HOME",
	37: "LEFT",
	38: "UP",
	39: "RIGHT",
	40: "DOWN",
	44: "PRINTSCREEN",
	45: "INSERT",
	46: "DELETE",
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	59: "SEMICOLON",
//	59: ";",
	61: "EQUALS",
	65: "A",
	66: "B",
	67: "C",
	68: "D",
	69: "E",
	70: "F",
	71: "G",
	72: "H",
	73: "I",
	74: "J",
	75: "K",
	76: "L",
	77: "M",
	78: "N",
	79: "O",
	80: "P",
	81: "Q",
	82: "R",
	83: "S",
	84: "T",
	85: "U",
	86: "V",
	87: "W",
	88: "X",
	89: "Y",
	90: "Z",
	93: "CONTEXT_MENU",
	96: "NUMPAD0",
	97: "NUMPAD1",
	98: "NUMPAD2",
	99: "NUMPAD3",
	100: "NUMPAD4",
	101: "NUMPAD5",
	102: "NUMPAD6",
	103: "NUMPAD7",
	104: "NUMPAD8",
	105: "NUMPAD9",
	106: "MULTIPLY",
	106: "*",
	107: "ADD",
//	107: "+",
	107: "=",
	108: "SEPARATOR",
//	108: "|",
	109: "SUBTRACT",
//	109: "-",
	110: "DECIMAL",
//	110: ".",
	111: "DIVIDE",
	112: "F1",
	113: "F2",
	114: "F3",
	115: "F4",
	116: "F5",
	117: "F6",
	118: "F7",
	119: "F8",
	120: "F9",
	121: "F10",
	122: "F11",
	123: "F12",
	124: "F13",
	125: "F14",
	126: "F15",
	127: "F16",
	128: "F17",
	129: "F18",
	130: "F19",
	131: "F20",
	132: "F21",
	133: "F22",
	134: "F23",
	135: "F24",
	144: "NUM_LOCK",
	145: "SCROLL_LOCK",
	188: "COMMA",
//	188: ",",
	190: "PERIOD",
//	190: ".",
	191: "SLASH",
//	191: "/",
	192: "BACK_QUOTE",
//	192: "`",
	219: "OPEN_BRACKET",
//	219: "[",
	220: "BACK_SLASH",
//	220: "\\",
	221: "CLOSE_BRACKET",
//	221: "]",
	222: "QUOTE",
//	222: "'",
	224: "META",
	
	"CANCEL":3,
	"HELP":6,
	"BACK_SPACE":8,
	"BACKSPACE":8,
	"TAB":9,
	"CLEAR":12,
	"RETURN":13,
	"ENTER":14,
	"SHIFT":16,
	"CONTROL":17,
	"ALT":18,
	"PAUSE":19,
	"CAPS_LOCK":20,
	"ESCAPE":27,
	"SPACE":32,
	" ":32,
	"PAGE_UP":33,
	"PAGE_DOWN":34,
	"END":35,
	"HOME":36,
	"LEFT":37,
	"UP":38,
	"RIGHT":39,
	"DOWN":40,
	"PRINTSCREEN":44,
	"INSERT":45,
	"DELETE":46,
	".0":48,
	".1":49,
	".2":50,
	".3":51,
	".4":52,
	".5":53,
	".6":54,
	".7":55,
	".8":56,
	".9":57,
	"SEMICOLON":59,
	";":59,
	"EQUALS":61,
	"A":65,
	"B":66,
	"C":67,
	"D":68,
	"E":69,
	"F":70,
	"G":71,
	"H":72,
	"I":73,
	"J":74,
	"K":75,
	"L":76,
	"M":77,
	"N":78,
	"O":79,
	"P":80,
	"Q":81,
	"R":82,
	"S":83,
	"T":84,
	"U":85,
	"V":86,
	"W":87,
	"X":88,
	"Y":89,
	"Z":90,
	"CONTEXT_MENU":93,
	"NUMPAD0":96,
	"NUMPAD1":97,
	"NUMPAD2":98,
	"NUMPAD3":99,
	"NUMPAD4":100,
	"NUMPAD5":101,
	"NUMPAD6":102,
	"NUMPAD7":103,
	"NUMPAD8":104,
	"NUMPAD9":105,
	"MULTIPLY":106,
	"*":106,
	"ADD":107,
	"+":107,
	"=":107,
	"SEPARATOR":108,
	"|":108,
	"SUBTRACT":109,
	"-":109,
	"DECIMAL":110,
	".":110,
	"DIVIDE":111,
	"F1":112,
	"F2":113,
	"F3":114,
	"F4":115,
	"F5":116,
	"F6":117,
	"F7":118,
	"F8":119,
	"F9":120,
	"F10":121,
	"F11":122,
	"F12":123,
	"F13":124,
	"F14":125,
	"F15":126,
	"F16":127,
	"F17":128,
	"F18":129,
	"F19":130,
	"F20":131,
	"F21":132,
	"F22":133,
	"F23":134,
	"F24":135,
	"NUM_LOCK":144,
	"SCROLL_LOCK":145,
	"COMMA":188,
	",":188,
	"PERIOD":190,
	".":190,
	"SLASH":191,
	"/":191,
	"BACK_QUOTE":192,
	"`":192,
	"OPEN_BRACKET":219,
	"[":219,
	"BACK_SLASH":220,
	"\\":220,
	"CLOSE_BRACKET":221,
	"]":221,
	"QUOTE":222,
	"'":222,
	"META":224,
};

Benchmark.stop('kit.unra.js','load');
/************************
** util.css.js
************************/
Benchmark.start('util.css.js');
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
Benchmark.stop('util.css.js','load');
/************************
** util.download.js
************************/
Benchmark.start('util.download.js');
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
				opt.error = function(e) {
					global.error(e);
					error.apply(this, arguments);
				};
				
				opt.load = function() {
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
			
			var fun = 'xhrGet';
			if(opt.type == 'POST') fun = 'xhrPost';
			dojo[fun].apply(dojo, [opt]);
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
		
		
		json: function(obj, scn) {
			
			if(typeof obj === 'string' && typeof scn === 'function') {
				var url = obj;
				url = url.replace(/#/g,'%2523');
				url = url.replace(/:/g,'%253A');
				url = url.replace(/</g,'%253C');
				url = url.replace(/>/g,'%253E');
				var opt = {
					'url': url,
					'handleAs': 'json',
					'error': function(e) {
						global.error('Could not parse JSON from response: "',url,'"');
						global.error(e);
					},
					'load': function(json) {
						if(json['error']) {
							global.warn('error response from: ',id,' ["',this.url,'"]');
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
				return dojo['xhrGet'](opt);
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
					'handleAs': 'json',
					'error': function(e) {
						global.error('Could not parse JSON from response: ',downloadId,' ["',this.url,'"]');
						global.error(e);
					},
				};
				
				(function() {
					var id = this.id;
					opt.load = function(json) {
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
				
				dojo['xhrGet'](opt);
			}
		},
	});
})();

Benchmark.stop('util.download.js','load');
/************************
** util.input-predictor.js
************************/
Benchmark.start('util.input-predictor.js');
/**
* public class InputPredictor

* @description  Calculates what the next value of a text input will be based on keydown events.
* 		This happens faster than the time it takes for a user to lift their finger from the key.
*		Instead of waiting for a keypress event (triggered by keyup), predict the input ASAP.
* @author		Blake Regalia
* @email		blake.regalia@gmail.com
*
**/
(function() {
	var __func__ = 'InputPredictor';
	var construct = function() {
		var self = {
			
		};
		var operator = function(e, val) {
			var node = e.target;
			var phrase = (typeof val !== 'undefined')? val: node.value;
			
			var chr = (e.shiftKey)? DOM_VK_KEY[e.keyCode]: DOM_VK_key[e.keyCode];
			
			var selmin = Math.min(node.selectionStart, node.selectionEnd);
			var selmax = Math.max(node.selectionStart, node.selectionEnd);
			
			
			if(chr) {
				phrase = phrase.substr(0,selmin) + chr + phrase.substr(selmax);
			}
			else {
				if(selmin !== selmax) {
					if((DOM_VK[e.keyCode] === 'BACKSPACE') || (DOM_VK[e.keyCode] === 'DELETE')) {
						phrase = phrase.substr(0,selmin) + phrase.substr(selmax);
					}
				}
				// no text selected and non-character key pressed
				else {
					if(DOM_VK[e.keyCode] === 'BACKSPACE') {
						phrase = (selmin===0)? phrase: phrase.substr(0,selmin-1) + phrase.substr(selmin);
					}
					else if(DOM_VK[e.keyCode] === 'DELETE') {
						phrase = phrase.substr(0,selmin) + ((selmax===phrase.length)? '': phrase.substr(selmin+1));
					}
				}
			}
			
			return phrase;
		};
		$.extend(operator, {
			
		});
		return operator;
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
		
	});
})();
Benchmark.stop('util.input-predictor.js','load');
/************************
** util.threaded-loop.js
************************/
Benchmark.start('util.threaded-loop.js');
/**
* public class ThreadedLoop

* @description  Runs a user-defined loop-like function in multiple iterations to avoid hanging the 
* 		main thread. This essentially accomplishes threading.
* @author		Blake Regalia
* @email		blake.regalia@gmail.com
*
**/
(function() {
	var __func__ = 'ThreadedLoop';
	var construct = function(program, opt) {
		var cycle_time = opt.cycleTime || 10;
		var breathe_time = opt.breatheTime || 0;
		var is_running;
		var timer;
		var inter_cycle = 0;
		
		var initial_loop_data = opt.data || {};
		var exec_on_start = opt.beforeStart || function(){};
		
		// begin a cycle of the loop
		var start = function() {
			inter_cycle = 0;
			timer = new Timer(cycle_time);
			program.apply(self, arguments);
		};
		
		var self = {
			data: {},
			
			// returns true while the loop should continue
			runs: function() {
				// if the loop was cancelled, return false
				if(!is_running) {
					return false;
				}
				
				// while the loop is running...
				else {
					// update the timer
					timer();
					
					// and return the status of this cycle
					return !timer.expired;
				}
			},
			
			
			// continue the loop in a new thread
			cycle: function() {
				
				// if this loop is still alive
				if(is_running) {
					
					// start the next thread
					inter_cycle = setTimeout(start, breathe_time);
				}
			},
			
			// terminate the loop
			die: function() {
				is_running = false;
			},
		};
		
		var operator = function() {
			// set the flag that this loop is in progress
			is_running = true;
			
			// initialize the loop data
			delete self.data;
			self.data = $.extend(true, {}, initial_loop_data);
			exec_on_start.apply(self);
			self.data.start_time = (new Date()).getTime();
			
			// start the loop in a thread
			setTimeout(start, 0);
		};
		$.extend(operator, {
			
			// sets the cycle duration
			// longer cycles execute faster, shorter cycles allow for better chance of interuption
			setCycleTime: function(ms) {
				cycle_time = ms;
			},
			
			setSleepTime: function(ms) {
				sleep_time = ms;
			},
			
			setLoopData: function(data) {
				initial_loop_data = data;
			},
			
			onStart: function(exec) {
				exec_on_start = exec;
			},
			
			// interupt the loop
			interupt: function() {
				clearTimeout(inter_cycle);
				is_running = false;
			},
			
			// allow change to data
			data: function(obj) {
				$.extend(true, self.data, obj);
			},
			
			lastResults: function() {
				return this.data.results || false;
			},
		});
		return operator;
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
		
	});
})();

Benchmark.stop('util.threaded-loop.js','load');
/************************
** meta.geometry.js
************************/
Benchmark.start('meta.geometry.js');
(function() {
	
	var __func__ = 'Geometry';
	
	var esri_geometry = esri['geometry'];
	var esri_point = esri_geometry['Point'];
	var esri_extent = esri_geometry['Extent'];
	var esri_polygon = esri_geometry['Polygon'];
	
	var spatialReference = {'wkid':4326};
	var esri_spatialReference = new esri['SpatialReference'](spatialReference);
	
	var serverSpatialReference = {'wkid':102113};
	var esri_serverSpatialReference = new esri['SpatialReference'](serverSpatialReference);
	
	var projectToWM = function(lat,lng) {
		var source = new Proj4js['Proj']('EPSG:4326');
		var dest = new Proj4js['Proj']('EPSG:900913');
		var tran = new Proj4js['Point'](lng, lat);   //any object will do as long as it has 'x' and 'y' properties
		Proj4js['transform'](source, dest, tran);
		
		return tran;
	}
	
	var construct = function(obj) {
		
		
		/**
		* private:
		**/
		var geometry;
		
		(function() {
			var point = obj.point;
			var extent = obj.extent;
			var polygon= obj.polygon;
			
			if(point) {
				geometry = new esri_point(point.x, point.y, esri_spatialReference);
			}
			
			if(extent) {
				
				if(extent instanceof Array) {
					if(extent.length === 4) {
						if(obj.system === 'lat-lng') {
							var sp = projectToWM(extent[0],extent[1]);
							extent[0] = sp.x; extent[1] = sp.y;
							sp = projectToWM(extent[2],extent[3]);
							extent[2] = sp.x; extent[3] = sp.y;
						}
						extent.push(esri_spatialReference);
					}
					geometry = esri_extent.apply({}, extent);
				}
				else {
					if(!extent.spatialReference) extent.spatialReference = spatialReference;
					geometry = esri_extent.apply({}, [extent]);
				}
			}
			
			if(polygon) {
				polygon.spatialReference = serverSpatialReference;
				geometry = new esri_polygon(polygon);
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
			return geometry;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			//
			isMetaGeometry: true,
			
			//
			declaredClass: true,
		});
		
		
		return operator;
		
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
		
		point: function(x, y) {
			return new Geometry({
				point: {
					x: x,
					y: y,
				},
			});
		},
	});
})();
Benchmark.stop('meta.geometry.js','load');
/************************
** meta.map.js
************************/
Benchmark.start('meta.map.js');
(function() {
	
	var __func__ = 'Map';
	
	var instance;
	
	/**
	* protected static:
	**/
	var map;
	
	var esri_graphic = esri['Graphic'];
	var esri_layers = esri['layers'];
	var esri_graphicsLayer = esri_layers['GraphicsLayer'];
	
	var coordinateSystem = new esri['SpatialReference']({'wkid': 4326});
	
	var layers = {
		' ': new esri_graphicsLayer(),
	};
	
	
	var construct = function() {
		
		map = EsriMap.getMap();
		map['addLayer'](layers[' ']);
		
		/**
		* private:
		**/
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			setCenter: function(x, y) {
				var point = new Geometry.point(x, y);
				map['centerAt'](point());
			},
		});
		
		
		return operator;
		
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
		
		
		//
		clear: function(layerName) {
			if(!arguments.length) {
				for(var e in layers) {
					layers[e].clear();
				}
			}
			else {
				layers[layerName].clear();
			}
		},
		
		
		//
		getLayer: function(layerName) {
			return layers[layerName];
		},
		
		
		//
		add: function(geometry, symbol, layerName, maxLayerObjects) {
			
			if(!geometry.declaredClass)		geometry = new Geometry(geometry);
			if(geometry.isMetaGeometry)		geometry = geometry();
			
			if(!symbol.declaredClass)		symbol = new Symbol(symbol);
			if(symbol.isMetaSymbol)			symbol = symbol();
			
			var layer;
			if(layerName) {
				if(layers[layerName]) {
					layer = layers[layerName];
				}
				else {
					layer = new esri_graphicsLayer();
					layers[layerName] = layer;
					map['addLayer'](layer);
				}
			}
			else {
				layer = layers[' '];
			}
			
			layer['add'](
				new esri_graphic(geometry, symbol)
			);
			
			
			if(typeof maxLayerObjects == 'number') {
				var layer_graphics = layer['graphics'];
				while(layer_graphics.length > maxLayerObjects) {
					layer['remove'](layer_graphics[0]);
				}
			}
			
			var chain = {
				layer: layer,
			};
			
			$.extend(chain, {
				
				// call this chained function to center the map at the last graphics object added
				center: function(extra) {
					var ext = layer['graphics'][layer['graphics']['length']-1]['_extent'];
					var center = ext['getCenter']();
					if(extra) {
						pxw = map['extent']['getWidth']() / map['width'];
						
						var x = extra.x;
						var y = extra.y;
						var expand = extra.expand;
						
						if(x) {
							center.x -= pxw * x;
						}
						if(y) {
							if(typeof y === 'string') {
								if(y[y.length-1] == '%') {
									center.y += map['height'] * parseFloat(y)*0.01;
								}
							}
						}
						if(expand) {
							map['setExtent'](ext['expand'](expand));
							return chain;
						}
					}
					map['centerAt'](center);
					return chain;
				},
			
				fadeOut: function() {
					var alpha = 1;
					var d = function() {
						layer['setOpacity'](alpha);
						alpha = alpha * 0.95*alpha;
						if(alpha > 0.1) {
							setTimeout(d, 30);
						}
					}; d();
				},
			});
			
			return chain;
		},
	});
})();
Benchmark.stop('meta.map.js','load');
/************************
** meta.symbol.js
************************/
Benchmark.start('meta.symbol.js');
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
	
	var esri_symbol = esri['symbol'];
	var esri_simpleFill = esri_symbol['SimpleFillSymbol'];
	var esri_simpleLine = esri_symbol['SimpleLineSymbol'];
	
	
	
	var resolveColorStr = function(str) {
		var x;
		if((x=/^rgb(a?)\((\d+),(\d+),(\d+),?([0-9\.]+)?\)$/.exec(str)) !== null) {
			if(x[1].length) {
				return new dojo['Color']([parseInt(x[2]), parseInt(x[3]), parseInt(x[4]), parseFloat(x[5])]);
			}
			return new dojo['Color']([parseInt(x[2]), parseInt(x[3]), parseInt(x[4])]);
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
			var fillColor = new dojo['Color'](0,0,0);
			
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
			var outlineColor = new dojo['Color']([0,0,0]);
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
		var operator = function() {
			return symbol;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			//
			isMetaSymbol: true,
			
			//
			declaredClass: true,
		});
		
		
		return operator;
		
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
Benchmark.stop('meta.symbol.js','load');
/************************
** class.building.js
************************/
Benchmark.start('class.building.js');
/**
*
* public class Building
*
**/
(function() {
	
	var __func__ = 'Building';
	
	var database = {
		abrvToBid: {},
		nameToBid: {},
		polygon: {},
	};
	var downloadsReady = false;
	
	var highlightBuilding = new Symbol({
		fill: 'rgba(255,0,0,0.3)',
		stroke: {
			color: 'rgba(255,0,0,0.75)',
			style: 'solid',
			width: 3,
		},
	});
	
	var construct = function(building) {
		
		/**
		* private:
		**/
		var buildingId = building.buildingId;
		var buildingName = building.buildingName;
		
		var callbackPolygon = false;
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return building;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: building.buildingId,
			
			
			// returns the extent of this building
			getExtent: function() {
				return database.extents[buildingId];
			},
			
			
			// returns the name of this building
			getName: function() {
				return database.bidToName[buildingId];
			},
			
			// calls a function when the geometry is ready
			getPolygon: function(callback) {
				if(database.polygon[buildingId]) {
					callback.apply(callback, [database.polygon[buildingId]]);
				}
				else {
					callbackPolygon = callback;
				}
			},
			
			
			// over-ride toString method
			toString: function() {
				return __func__+' '+buildingid;
			},
		});
		
		
		if(!database.polygon[buildingId]) {
			Download.json('server/9/query?returnGeometry=true&f=pjson&text='+buildingName, function(json) {
				database.polygon[buildingId] = json.features[0].geometry;
				if(callbackPolygon) {
					callbackPolygon.apply({}, [json.features[0].geometry]);
				}
			});
		}
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(a, b) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return new global({
				buildingId: a,
				buildingName: b,
				buildingAbrv: global.idToAbrv(a),
			});
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
		
		
		//
		newCard: function(format) {
			return function(str) {
				Download.json("data/ucsb/facilities.building@(["+format+"]='"+str+"').json",
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var building = new global(json[0]);
						new BuildingCard(building);
					}
				);
			};
		},
		
		
		// attempt to translate a building abbreviation to a building id
		abrvToId: function(buildingAbrv) {
				
			// perform a hash-table lookup on the input string
			var buildingId = database.abrvToBid[buildingAbrv];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building abrv not found: "',buildingAbrv,'"');
				return false;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		
		// attempt to translate an building name to a building id
		nameToId: function(buildingName) {
			
			// perform a hash-table lookup on the input string
			var buildingId = database.nameToBid[buildingName];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building name not found: "',buildingName,'"');
				return false;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		// attempt to translate an building name to a building id
		idToName: function(buildingId) {
			
			// perform a hash-table lookup on the input string
			var buildingName = database.bidToName[buildingId];
			
			// check if an entry exists for the given building name
			if(typeof buildingName === 'undefined') {
				global.error('building id not found: ',buildingId,'');
				return false;
			}
			
			// return the name
			return buildingName;
		},
		
		// attempt to translate a building abbreviation to a building id
		idToAbrv: function(buildingId) {
			
			var abrv = database.abrvToBid;
			
			for(var e in abrv) {
				if(abrv[e] == buildingId) return e;
			}
			
			// return the id number if it was found
			return false;
		},
		
	});
	
	
	/**
	* 1-time invocation 
	**/
	Download.json({
		urls: {
			nameToBid: 'data/ucsb/facilities.building#{`buildingName`:`buildingId`}.json',
			abrvToBid: 'data/ucsb/facilities.building#{`buildingAbrv`:`buildingId`}.json',
			bidToName: 'data/ucsb/facilities.building#{`buildingId`:`buildingName`}.json',
			extents: 'data/ucsb/facilities.building#{`buildingId`:[~`ymin`,~`xmin`,~`ymax`,~`xmax`]}.json',
		},
		each: function(id, json) {
			database[id] = json;
		},
		ready: function() {
			downloadsReady = true;

			/**
			var bidToName = database.bidToName;
			for(var buildingId in bidToName) {
				var buildingName = bidToName[buildingId];
				Download.json('server/9/query?outFields=features&f=pjson&text='+buildingName, function(json) {
					database.polygon[buildingId] = json.features[0].geometry;
				});
			}
			**/
		},
	});
	
})();
Benchmark.stop('class.building.js','load');
/************************
** class.contact.js
************************/
Benchmark.start('class.contact.js');
(function() {
	
	var __func__ = 'Contact';
	
	
	
	var construct = function(contact) {
		
		/**
		* private:
		**/
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return contact;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: contact.firstName+' '+contact.lastName,
			
			// convenience field for this user's full name
			fullName: contact.firstName+' '+contact.lastName,
		});
		
		
		return operator;
		
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
		
		
		//
		newCard: function(format) {
			return function(str) {
				Download.json("data/ucsb/directory.people@(["+format+"]='"+str+"').json", 
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var contact = new Contact(json[0]);
						new ContactCard(contact);
					}
				);
			};
		},
		
	});
})();
Benchmark.stop('class.contact.js','load');
/************************
** class.department.js
************************/
Benchmark.start('class.department.js');
(function() {
	var __func__ = 'Department';
	
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var operator = function() {
			
		};
		
		
		$.extend(operator, {
			
		});
		
		
		return operator;
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
		
		newCard: function(departmentName) {
			new DepartmentCard(departmentName);
		},
		
		toString: function() {
			return __func__+'()';
		}
		
	});
})();
Benchmark.stop('class.department.js','load');
/************************
** class.location.js
************************/
Benchmark.start('class.location.js');
(function() {
	
	var __func__ = 'Location';
	
	var wordRegex = /^\s*([a-z][^\s]*)[\s\-\.\:]*$/i;
	var numberRegex = /^\s*([0-9][^\s]*)[\s\-\.\:]*$/i;
	var bldgRegex = /^([a-z].*)[\s\-\.\:]+(\d\w+)$/i;
	var bidRegex  = /^([0-9].*)[\s\-\.\:]+(\d\w+)$/i;
	var roomRegex = /^(\d\w+)[\s\-\.\:]+([a-z].*)$/i;
	
	var construct = function(str) {
		
		/**
		* private:
		**/
		var resolved = true;
		
		var buildingName;
		var buildingId;
		var roomNumber;
		
		(function() {
			var x;
			
			// eg: ELLSN
			if((x=wordRegex.exec(str)) !== null) {
				buildingName = x[1];
			}
			
			// eg: 563
			else if((x=numberRegex.exec(str)) !== null) {
				buildingId = x[1];
			}
			
			// eg: Ellison Hall 1710A
			else if((x=bldgRegex.exec(str)) !== null) {
				buildingName = x[1];
				roomNumber = x[2];
			}
			
			// eg: 1710A Ellison
			else if((x=roomRegex.exec(str)) !== null) {
				roomNumber = x[1];
				buildingName = x[2];
			}
			
			// eg: 563 1710A
			else if((x=bidRegex.exec(str)) !== null) {
				buildingId = x[1];
				roomNumber = x[2];
			}
			
			
			// resolve targets
			if(buildingName) {
				buildingId = Building.abrvToId(buildingName.toUpperCase());
				if(!!buildingId) {
					buildingName = Building.idToName(buildingId);
					if(!buildingName) {
						global.warn('could not resolved building id: ',buildingId);
						resolved = false;
					}
				}
				else {
					buildingId = Building.nameToId(buildingName);
					if(!buildingId) {
						buildingId = Building.nameToId(buildingName+' Hall');
						if(!buildingId) {
							global.warn('could not resolve building "',buildingName,'"');
							resolved = false;
						}
					}
				}
			}
			else {
				buildingName = Building.idToName(buildingId);
				if(!buildingName) {
					global.warn('could not resolved building id: ',buildingId);
					resolved = false;
				}
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
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			isLocation: true,
			
			resolved: resolved,
			
			isRoom: roomNumber && !!roomNumber.length,
			
			getRoom: function() {
				return Room(buildingId, roomNumber);
			},
			
			execute: function() {
				if(operator.isRoom) {
					var room = Room(buildingId, roomNumber);
					return new RoomCard(room);
				}
				else if(resolved) {
					var building = Building(buildingId, buildingName);;
					return new BuildingCard(building);
				}
			},
			
			toString: function() {
				if(roomNumber.length) {
					return buildingName+' '+roomNumber;
				}
				else if(resolved) {
					return buildingName;
				}
				return str;
			},
		});
		
		
		return operator;
		
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
Benchmark.stop('class.location.js','load');
/************************
** class.reference.js
************************/
Benchmark.start('class.reference.js');
(function() {
	
	var __func__ = 'Reference';
	
	
	// create the standard dom node for a reference
	var refer = function(args, html, tag) {
		
		if(!tag) tag = 'div';
		
		// assert the required attributes have values
		$.extend({
			title: '',
			class: '',
		}, args);
		
		
		// create the element & return it
		return dojo['create'](tag, {
			class: args.class,
			innerHTML: args.title+html,
		});
	};
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		var operator = function() {
			
		};
		
		$.extend(operator, {
			isReference: true,
		});
		
		return operator;
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
		
		administration: function(people) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html = '';
				
				var i = people.length;
				while(i--) {
					var person = people[i];
					html += '<div><button link="'+person.firstName+' '+person.lastName+'">'+person.title+'</button></div>';
				}
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo['query']('button', e_dom).forEach( function(elmt) {
					dojo['connect'](
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new ContactCard(
								dojo['attr'](elmt, 'link')
							);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		building: function(buildingId) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				html = '<button>'+(new Building(buildingId)).getName()+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo['query']('button', e_dom).forEach( function(elmt) {
					dojo['connect'](
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new BuildingCard(buildingId);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		contact: function(people, names) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				// reference the length of resolved contacts
				var i = people.length;
				
				// if there aren't any resolved names
				if(!i) {
					// use the backup names
					html = names;
				}
				else {
					html = [];
					while(i--) {
						// build elements for the links
						var fullName = people[i];
						html.push('<button link="'+fullName+'">'+fullName+'</button>');
					}
					// implode the html string array
					html = html.join('');
				}
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo['query']('button', e_dom).forEach( function(elmt) {
					dojo['connect'](
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new ContactCard(
								dojo['attr'](elmt,'link')
							);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		course: function(courses) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				// reference the length of resolved contacts
				var i = courses.length;
				
				html = [];
				while(i--) {
					// build elements for the links
					var courseTitle = courses[i];
					html.push('<button link="'+courseTitle+'">'+courseTitle+'</button>');
				}
				// implode the html string array
				html = html.join('');
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo['query']('button', e_dom).forEach( function(elmt) {
					dojo['connect'](
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new LectureCard(
								dojo['attr'](elmt,'link')
							);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		department: function(str) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button link="'+str+'">'+str+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo['connect'](
					e_dom,
					'click',
					function(e) {
						e.stopPropagation();
						new DepartmentCard(str);
					}
				);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		email: function(str) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<a href="mailto:'+str+'">'+str+'</a>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo['connect'](e_dom, 'click', DOM_Event.noBubble);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		location: function(str) {
			
			var location = new Location(str);
			
			if(!location.resolved) {
				global.warn('could not create reference to unknown location');
			}
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button>'+location.toString()+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo['connect'](dojo['query']('button', e_dom)[0], 'click', function(e) {
					e.stopPropagation();
					location.execute();
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
			
		},
		
		
		website: function(url) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<a href="'+url+'">'+url+'</a>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo['connect'](e_dom, 'click', DOM_Event.noBubble);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		widget: function(namespace, data) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button>'+args.title+'</button>';
				
				args.title = '';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo['connect'](e_dom, 'click', function(e) {
					e.stopPropagation();
					console.info(namespace, data);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		toString: function() {
			return __func__+'()';
		},
	});
})();
Benchmark.stop('class.reference.js','load');
/************************
** class.room.js
************************/
Benchmark.start('class.room.js');
/**
*
* public class Room
*
**/
(function() {
	
	var __func__ = 'Room';
	
	var database = {
		abrvToBid: {},
		nameToBid: {},
		polygon: {},
	};
	var downloadsReady = false;
	
	var construct = function(room) {
		
		if(!downloadsReady) {
			global.warn('data has finished downloading yet');
		}
		
		/**
		* private:
		**/
		var buildingId = room.buildingId;
		var roomNumber = room.roomNumber;
		var buildingName = Building.idToName(buildingId);
		
		// this class does not perform any asynchronous lookups, everything is local
		if(!database.extents[buildingId]) {
			return global.error('could not find building-id: ',buildingId);
		}
		if(!database.extents[buildingId][roomNumber]) {
			return global.error('could not find room "',roomNumber,'" in building: ',buildingId);
		}
		
		var callbackPolygon = false;
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return room;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: room.buildingId+';'+roomNumber,
			
			// text to display as title
			title: buildingName,
			
			// text to display as subtitle
			subtitle: 'room '+roomNumber,
			
			// returns the extent of this building
			getExtent: function(ready) {
				if(!ready)	return global.error('must hand getExtent() a callback function');
				ready.apply(ready, [database.extents[buildingId][roomNumber]]);
			},
			
			
			// over-ride toString method
			toString: function() {
				return __func__+':'+buildingId+'-'+roomNumber;
			},
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(a, b) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return new global({
				buildingId: a,
				roomNumber: b,
			});
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
		
		
		//
		newCard: function(buildingId, roomNumber) {
			var room = global(buildingId, roomNumber);
			if(room && room.exists) {
				new RoomCard(room);
			}
		},
	
		
		//
		highlight: new Symbol({
			fill: 'rgba(255,255,0,0.3)',
			stroke: {
				color: 'rgba(255,0,0,0.75)',
				style: 'solid',
				width: 2,
			},
		}),
		
	});
	
	
	/**
	* 1-time invocation 
	**/
	Download.json({
		urls: {
			extents: 'data/ucsb/facilities.room#{`buildingId`:{`roomNumber`:[~`ymin`,~`xmin`,~`ymax`,~`xmax`]}}.json',
		},
		each: function(id, json) {
			database[id] = json;
		},
		ready: function() {
			downloadsReady = true;
		},
	});
	
})();
Benchmark.stop('class.room.js','load');
/************************
** gui.card.deck.js
************************/
Benchmark.start('gui.card.deck.js');


(function() {
	var __func__ = 'CardDeck';
	
	var own = {};
	
	var css = {
		card_spacing: 36,
		deck_top: -100,
	};
	
	var construct = function(key, deck_dom) {
		
		var my = {
			zindex_base: 2048,
			zindex_plus: 0,
			card_drawn: false,
		};
		var stack = [];
		var top = -1;
		
		var self = {
			
		};
		
		var operator = function() {
		};
		
		$.extend(operator, {
			
			
			// add a card to the top of the deck
			add: function(card) {
				
				// if the card on top is open
				if(top !== -1 && stack[top].isOpen()) {
					// fold the card on top
					operator.fold(top);
				}
				
				// push it to the end of the array
				top = stack.push(card) - 1;
				
				// store this card's index to itself
				card.index = top;
				
				// reference the dom element of the container
				var card_dom = card.getElement();
				
				// set the appropriate zindex, relative to the other cards in this deck
				operator.ztop(card_dom);
				
				// append the card to this container
				deck_dom.appendChild(card_dom);
				
				// register stack-like dom events to this card
				operator.draw(top);
			},
			
			
			// fold a card with the given index
			fold: function(index) {
				var card = stack[index];
				
				// reference the dom element of the bounding element
				var card_dom = card.getElement();
				
				dojo['addClass'](card_dom , 'card_deckview');
				
				var translate_y = index * css.card_spacing + css.deck_top;
				$.style(card_dom , 'margin-top', translate_y+'px');
				
				card.fold();
				operator.ztop(card_dom);
				
				card.click(function() {
					this.unbind();
					operator.draw(this.getIndex());
				});
				
				setTimeout(function() {
					if(!card.isOpen()) {
						dojo['addClass'](card_dom, 'settled');
					}
				}, 600);
				
				my.card_drawn = false;
				
				card.onFold();
			},
			
			
			// draw a folded card from the stack, bring it to the top
			draw: function(index) {
				
				if(typeof index !== 'number') {
					return global.error('draw method requires index argument to be integer');
				}
				if(index < 0 || index > stack.length) {
					global.error(index,' is out of bounds for ',stack);
				}
				
				if(my.card_drawn) {
					operator.fold(top);
				}
				
				var card = stack[index];
				var card_dom = card.getElement();
				
				card.open();
				card.index = operator.pull(index);
				
				dojo['removeClass'](card_dom , 'card_deckview');
				dojo['removeClass'](card_dom , 'settled');
				
				$.style(card_dom , 'margin-top', '0');
				
				card.click(function() {
					this.unbind();
					operator.fold(this.getIndex());
				});
				
				my.card_drawn = true;
				
				card.onDraw();
			},
			
			
			// swap the indicies of two cards in the stack
			swap: function(a, b) {
				Array.swap.apply(stack, [a, b]);
			},
			
			
			// pull the given card to the top of the stack
			pull: function(index) {
				
				stack.push(stack.splice(index, 1)[0]);
				
				for(var i=index; i<top; i++) {
					stack[i].index = i;
					var card_dom = stack[i].getElement();
					$.style(card_dom, 'margin-top',
						(parseInt($.style(card_dom, 'margin-top')) - css.card_spacing) + 'px'
					);
					dojo['removeClass'](card_dom, 'settled');
					setTimeout((function() {
						var elmt = this.card_dom;
						return function() {
							dojo['addClass'](elmt, 'settled');
						}
					}).apply({card_dom:card_dom}), 600);
				}
				
				operator.ztop(stack[top].getElement());
				
				return top;
			},
			
			
			// sets the zindex of the given element to be the top of this stack
			ztop: function(card_dom) {
				card_dom['style']['zIndex'] = my.zindex_base + my.zindex_plus++;
			},
			
			
			// remove a card from the deck
			discard: function() {
				
			},
			
			
			// compress the view of the deck
			close: function() {
				
			},
			
			
			// spread the view of the deck
			spread: function() {
				
			},
			
			
			// toggle the view between closed and spread
			toggle: function() {
				
			},
			
			
			// reorder the cards based on a user-defined comparison function
			usort: function() {
				
			},
			
		});
		
		return operator;
	};
	
	
	
	var global = window[__func__] = function(key) {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			own[key] = instance;
			return instance;
		}
		else {
			if(own[key]) {
				return own[key];
			}
			else {
				global.error(key,' not found as entry');
			}
		}
	};
	
	
	
	$.extend(global, {
		
		toString: function() {
			return __func__+'()';
		},
		
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
	});
})();
Benchmark.stop('gui.card.deck.js','load');
/************************
** gui.card.js
************************/
Benchmark.start('gui.card.js');
var DomEventControl = function(link) {
	return {
		unbind: function() {
			dojo['disconnect'](link);
		},
	};
};


/***

/* Card widgets *
 - title
 - subtitle
 - daysOfWeek
 - timesOfDay
 - content
/**/

/***
card.setup({
	
});

CardDeck('stack').add(card);

/**/


(function() {
	var __func__ = 'Card';
	
	var own = {};
	var cardId = 0;
	
	var basicCardHTML = function(cardIdNum) {
		var id = 'card_'+cardIdNum;
		return '<div id="'+id+'" class="card">'
				+'<div class="card-header">'
					+'<div class="card-icon"></div>'
					+'<span class="card-title"></span>'
					+'<span class="card-subtitle"></span>'
				+'</div>'
				+'<div class="card-header-separator"></div>'
				+'<div class="card-timeline">'
					+'<div class="card-timeline-days"></div>'
					+'<div class="card-timeline-times"></div>'
				+'</div>'
				+'<div class="card-references"></div>'
				+'<div class="card-header-separator"></div>'
				+'<div class="card-content-image" style="display:none;"></div>'
				+'<div class="card-content"></div>'
			+'</div>';
	};
	
	
	var lowerAlphaNum = function(str) {
		return str.toLowerCase().replace(/[^\w]/g,'-');
	};
	
	
	var construct = function(key, setup) {
		
		
		var my = {
			
			id: cardId,
			
			viewStatus: global.OPEN,
			
			// create a div element
			dom: dojo['create']('div', {
				id: 'card-'+cardId,
				class: 'card-container',
				
				innerHTML: basicCardHTML(cardId),
			}),
			
			eventListeners: {
				click: false,
			},
			
		};
		
		cardId += 1;
		
		
		var self = {
			controlBinding: function(eventListenerName) {
				return {
					getIndex: function() {
						return operator.index;
					},
					unbind: function() {
						dojo['disconnect'](my.eventListeners[eventListenerName]);
						my.eventListeners[eventListenerName] = false;
					},
				};
			},
		};
		
		
		var operator = function() {
			
		};
		
		
		$.extend(operator, {
			
			index: -1,
			
			// to be over-ridden by subclasses
			onDraw: function() {
				global.warn('onDraw meant to be over-ridden by extending subclass');
			},
			
			// to be over-ridden by subclasses
			onFold: function() {
				global.warn('onFold meant to be over-ridden by extending subclass');
			},
			
			isOpen: function() {
				return (my.viewStatus == global.OPEN);
			},
			
			// sets the cards view status 
			open: function() {
				my.viewStatus = global.OPEN;
			},
			
			// sets the cards view status 
			fold: function() {
				my.viewStatus = global.FOLDED;
			},
			
			
			// fetch the dom element of this card
			getElement: function() {
				return my.dom;
			},
			
			// fetch the dom element of this card
			getContainer: function() {
				return my.dom.parentNode;
			},
			
			
			// setup the card element
			setup: function(obj) {
				// reference the widget array
				var widgetArray = global.widget;
				
				// iterate through widget arguments
				for(var each in obj) {
					
					// reference the widget function
					var widget = widgetArray[each];
					
					// if the widget is not defined
					if(!widget) {
						
						// if there isn't a user-defined function for the widget name
						if(typeof obj[each] !== 'function') {
							global.error('widget not found: "',each,'"');
						}
						// otherwise, execute user-defined function
						else {
							obj[each].apply(my, []);
						}
						continue;
					}
					
					// build the card by predefined widgets
					widget.apply(my, [obj[each]]);
				}
			},
			
			
			// allow another class to assign this dom an event
			click: function(method) {
				if(my.eventListeners.click) {
					dojo['disconnect'](my.eventListeners.click);
					my.eventListeners.click = false;
				}
				my.eventListeners.click = dojo['connect'](my.dom.firstChild, 'onclick', function() {
					method.apply(self.controlBinding('click'), arguments);
				})
			},
			
			toString: function() {
				return __func__+': '+key;
			},
			
		});
		
		
		// in case this was instantiated with the optional setup object
		operator.setup(setup);
		
		
		return operator;
	};
	
	
	
	var global = window[__func__] = function(key) {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			if(own[key]) {
				return own[key];
			}
			//if(!own[key]) own[key] = [];
			//own[key].push(instance);
			own[key] = instance;
			return instance;
		}
		else {
			
		}
	};
	
	
	
	$.extend(global, {
		
		OPEN   : 0,
		FOLDED : 1,
	
		toString: function() {
			return __func__+'()';
		},
		
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		
		widget: {
			
			// creates a main title
			title: function(text) {
				var e_dom = dojo['query']('.card-header>.card-title', this.dom)[0];
				dojo['place']('<span class="card-title">'+text+'</span>', e_dom, 'replace');
			},
			
			
			// creates a subtitle
			subtitle: function(text) {
				var e_dom = dojo['query']('.card-header>.card-subtitle', this.dom)[0];
				dojo['place']('<span class="card-subtitle">'+text+'</span>', e_dom, 'replace');
			},
			
			// sets the icon image
			icon: function(url) {
				var e_dom = dojo['query']('.card-icon', this.dom)[0];
				dojo['place']('<img src="'+url+'" height="40px"></img>', e_dom, 'last');
			},
			
			
			// creates a view to indicate days of the week
			days: function(dayString) {
				
				// referemce the target element
				var e_dom = dojo['query']('.card-timeline>.card-timeline-days', this.dom)[0];
				
				
				var days = {
					S:false,
					M:false,
					T:false,
					W:false,
					R:false,
					F:false,
					A:false,
				};
				
				var len = dayString.length;
				for(var i=0; i<len; i++) {
					days[dayString[i].toUpperCase()] = true;
				}
				
				// string builder for the days timeline
				var b = '';
				var c = '';
				
				for(var each in days) {
					var on = days[each];
					b += on? '<span class="day-on">'+each+'</span>': '<span>'+each+'</span>';
				}
				
				// replace the html content of the days timeline
				dojo['place']('<span class="card-timeline-days">'
						+'<div class="days-row">'+b+'</div>'
					+'</span>', e_dom, 'replace');
			},
			
			
			// creates a view to indicate times of the days specified
			times: function(obj) {
				
				
				// referemce the target element
				var e_dom = dojo['query']('.card-timeline>.card-timeline-times', this.dom)[0];
				
				if(typeof obj === 'string') {
					var timeMatch = /(\d+):(\d+)\s*([ap]m)\s*[\-]\s*(\d+):(\d+)\s*([ap]m)/i.exec(obj);
					var startTime = {
						hour: parseInt(timeMatch[1]),
						minute: parseInt(timeMatch[2]),
						ampm: timeMatch[3].toLowerCase(),
					};
					var endTime = {
						hour: parseInt(timeMatch[4]),
						minute: parseInt(timeMatch[5]),
						ampm: timeMatch[6].toLowerCase(),
					};
					
					
				}
				
				// string builder for the days timeline
				var b = '';
				var c = '';
				
				var add;
				var sub = 8;
				var rng = 13;
				add = startTime.ampm === 'pm'? 12: 0;
				var stu = ((startTime.hour+add-sub)*60+startTime.minute) / (60*rng);
				add = endTime.ampm === 'pm'? 12: 0;
				var etu = ((endTime.hour+add-sub)*60+endTime.minute) / (60*rng);
				
				stu *= 100;
				etu *= 100;
				
				
				b += '<span style="left:'+(stu-5)+'%; position:inherit;" class="time-block">';
					b += '<span style="left:'+stu+'%;" class="time-start">'+startTime.hour+':'+String.fill('00',startTime.minute)+' '+startTime.ampm+'-</span>';
					b += '<span style="left:'+etu+'%;" class="time-end">'+endTime.hour+':'+String.fill('00',endTime.minute)+' '+endTime.ampm+'</span>';
				b += '</span>';
				
				c += '<span style="left:'+stu+'%; width:'+(etu-stu)+'%"></span>';
				
				// replace the html content of the days timeline
				dojo['place']('<span class="card-timeline-times">'
						+'<div class="times-row">'+b+'</div>'
						+'<div class="blocks-row">'+c+'</div>'
					+'</span>', e_dom, 'replace');
			},
			
			
			// fills the content view
			content: function(obj) {
				
				var e_dom = dojo['query']('.card-content', this.dom)[0];
				
				// string builder for the content html
				var b = '';
				
				// iterate through the tags
				for(var each in obj) {
					
					// switch on the target
					var target = obj[each];
					switch(typeof target) {
						
						// simple html
						case 'string':
							dojo['place'](
								'<div>'
									+'<span class="card-content-item">'+each+': </span>'
									+'<span class="card-content-text">'+target+'</span>'
								+'</div>',
								e_dom,
								'last'
							);
							break;
							
						// a functionable object
						case 'function':
						case 'object':
							if(target.isReference) {
								dojo['place'](
									target.build({
										title: each+': ',
										class: 'card-content-'+each.toLowerCase().replace(/[^\w]/g,'_'),
									}),
									e_dom,
									'last'
								);
								
							}
							
							break;
					}
				}
			},
			
			references: function(obj) {
				
				// get the node to put the elements in
				var e_dom = dojo['query']('.card-references', this.dom)[0];
				
				// iterate through the tags
				for(var each in obj) {
							
					// reference the item
					var item = obj[each];
					
					// check the item is a reference object
					if(!item.isReference) {
						global.warn('"',each,'" item is not a reference object: ',item);
						continue;
					}
					
					// build an element
					b = item.build({
						title: each+': ',
						class: 'card-reference-'+lowerAlphaNum(each),
					});
					
					// append it to the parent node
					dojo['place'](b, e_dom, 'last');
				}
				
			},
			
			// creates a view to indicate 1 graphic associated with this card
			image: function(obj) {
				//var e_dom = dojo['query']('.card-content-image', this.dom, 'replace')[0];
				var e_dom = dojo['query']('.card-content-image', this.dom)[0];
				e_dom['style']['display'] = 'block';
				
				if(obj.google && !obj.google.demo) {
					GoogleImageSearch(obj.google.args[0], function(url) {
						var img = '<img src="'+url+'" style="max-width:320px; max-height:200px;"/>';
						dojo['place'](img, e_dom);
					});
				}
				else if(obj.url) {
					var img = '<img src="'+obj.url+'" style="max-width:320px; max-height:200px;"/>';
					dojo['place'](img, e_dom);
				}
			}
		},
	});
})();


Benchmark.stop('gui.card.js','load');
/************************
** gui.card.type.building.js
************************/
Benchmark.start('gui.card.type.building.js');
/**
*
* public class BuildingCard extends Card
*
**/
(function() {
	
	var __func__ = 'BuildingCard';
	
	
	var highlightBuilding = new Symbol({
		fill: 'rgba(255,0,0,0.3)',
		stroke: {
			color: 'rgba(255,0,0,0.75)',
			style: 'solid',
			width: 3,
		},
	});
	
	
	var construct = function(building) {
		
		// super's constructor
		var card = new Card('building:'+building.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = building();
		var references = {};
		
		// setup the format of the card
		card.setup({
			title: raw.buildingName,
			subtitle: raw.buildingAbrv,
			icon: 'resource/card.icon.building.png',
			content: {
			},
		});
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(card, {
			
			// fires when the card is drawn from the stack
			onDraw: function(){
				building.getPolygon(function(geometry) {
					Map.add(
						{
							polygon: geometry,
						},
						highlightBuilding,
						'highlight',
						1
					).center({
						x: -CSS('cardDeck.info.width').pixels(
								dojo['position'](document.body).w
							)*0.35,
						y: '-1%',
						expand: 5,
					});
				});
			},
			
			// fires when the card is being folded into the stack
			onFold: function() {
				Map.clear('highlight');
			},
		});
		
		
		// add this card to the stack
		CardDeck('stack').add(card);
		
		return card;
		
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
Benchmark.stop('gui.card.type.building.js','load');
/************************
** gui.card.type.contact.js
************************/
Benchmark.start('gui.card.type.contact.js');
/**
*
* public class ContactCard extends Card
*
**/
(function() {
	
	var __func__ = 'ContactCard';
	
	
	
	var construct = function(contact) {
		
		// super's constructor
		var card = new Card('contact:'+contact.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = contact();
		var references = {};
		var location = new Location(raw.location);
		
		// resolve references to courses
		if(raw.instructs.length) {
			references['Instructs'] = new Reference.course(String.splitNoEmpty(raw.instructs));
		}
		
		// resolve office location
		if(raw.location.length) {
			references['Office'] = new Reference.location(raw.location);
		}
		
		// setup the format of the card
		card.setup({
			title: contact.fullName,
			subtitle: raw.title,
			icon: 'resource/card.icon.contact.png',
			content: {
				'Department': new Reference.department(raw.department),
				'Title': raw.title,
				'Email': new Reference.email(raw.email),
			},
			/*
			image: {
				google: {
					demo: (raw.firstName.toLowerCase() == 'blake' && raw.lastName.toLowerCase() == 'regalia')? true: false,
					args: [raw.firstName+' '+raw.lastName],
				},
				url: 'http://www.excursionclubucsb.org/Excursion_Club_at_UCSB/bio/blake.jpg',
			},
			*/
			references: references,
		});
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(card, {
			
			// must be over-ridden
			onDraw: function(){
				if(location.resolved && location.isRoom) {
					location.getRoom().getExtent(function(geometry) {
						Map.add({
							extent: geometry,
							system: 'lat-lng',
						}, Room.highlight, 'highlight', 1).center({expand:2});
					});
				}
			},
			
			// must be over-ridden
			onFold: function() {},
		});
		
		
		// add this card to the stack
		CardDeck('stack').add(card);
		
		return card;
		
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
Benchmark.stop('gui.card.type.contact.js','load');
/************************
** gui.card.type.room.js
************************/
Benchmark.start('gui.card.type.room.js');
/**
*
* public class RoomCard extends Card
*
**/
(function() {
	
	var __func__ = 'RoomCard';
	
	var highlightRoom = Room.highlight;
	
	var construct = function(room) {
		
		// super's constructor
		var card = new Card('room:'+room.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = room();
		var references = {};
		
		// setup the format of the card
		card.setup({
			title: room.title,
			subtitle: room.subtitle,
			icon: 'resource/card.icon.room.png',
			content: {
			},
		});
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(card, {
			
			// fires when the card is drawn from the stack
			onDraw: function(){
				room.getExtent(function(geometry) {
					Map.add(
						{
							extent: geometry,
							system: 'lat-lng',
						},
						highlightRoom,
						'highlight',
						1
					).center({
						x: -CSS('cardDeck.info.width').pixels(
								dojo['position'](document.body).w
							)*0.35,
						y: '-1%',
						expand: 2,
					});
				});
			},
			
			// fires when the card is being folded into the stack
			onFold: function() {
				Map.clear('highlight');
			},
		});
		
		
		// add this card to the stack
		CardDeck('stack').add(card);
		
		return card;
		
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
Benchmark.stop('gui.card.type.room.js','load');
/************************
** gui.card.types.js
************************/
Benchmark.start('gui.card.types.js');



// LectureCard extends Card
(function() {
	var __func__ = 'LectureCard';
	
	
		
	/****
	
	Time / Day Indicator
	
<div>
	<div class="card_heading_separator">
	<div style="position: absolute; background-color: red; height: 3px; left: 60%; width: 9%;" class="time_span">
	</div>
	</div>
	<div style="color: red; position: relative; font-size: 10pt; left: 51%; width: 105px; padding-left: 5px; border-radius: 5px 5px 5px 5px; background-color: rgba(240, 240, 180, 0.2); margin-top: 2px;">3:30pm - 4:45pm</div>
</div>
	
*****/
	
	var construct = function(name) {
		
		var card = new Card('course:'+name);
		
		console.log(card.index);
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		var lecture = false;
		var pendingOnDrawAction = false;
		
		var courseTitle = name;
		
		Download.json("data/ucsb/registrar.lecture@(`courseTitle`='courseTitle').json",
			function(json) {
				lecture = json[0];
				
				card.setup({
					title: lecture.courseTitle,
					subtitle: lecture.fullTitle,
					icon: 'resource/card.icon.course.gif',
					references: {
						'Instructor': new Reference.contact(String.splitNoEmpty(lecture.people,';'), lecture.instructor),
						'Location': new Reference.location(lecture.location),
					},
					content: {
						'Description': lecture.description,
						'Days': lecture.days,
						'Time': lecture.time,
					},
					days: lecture.days,
					times: lecture.time,
				});
				
				if(card.isOpen() && pendingOnDrawAction) {
					card.onDraw();
				}
			}
		);
		
		var deck = false;
		
		var self = {
			create: function() {
			},
		};
		
		$.extend(card, {
			
			// what to do when this card is brought to the top of the stack
			onDraw: function() {
				if(!lecture) {
					pendingOnDrawAction = true;
					global.warn('lecture data not downloaded yet');
					return;
				}
				var room = RoomLocator.search(lecture.location);
				if(room && room.exists) {
					EsriMap.focus(room);
					//EsriMap.setCenter(room.getPoint());
				}
				else {
					global.error('unable to resolve location: ',lecture.location);
				}
			},
		});
		
		self.create();
		
		CardDeck('stack').add(card);
		
		return card;
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
		toString: function() {
			return __func__+'()';
		},
		
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.warn.apply(console, args);
		},
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.error.apply(console, args);
		},
	});
})();




















// DepartmentCard extends Card
(function() {
	var __func__ = 'DepartmentCard';
	
	var construct = function(departmentName) {
		
		var card = new Card('department:'+departmentName);
		
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		var pendingOnDrawAction = false;
		
		Download.json("data/ucsb/directory.department@(`departmentName`='"+departmentName+"').json",
			function(json) {
				dept = json[0];
				
				var content = {
					'Website': new Reference.website(dept.website),
				};
				if(dept.abrv) {
					content['Advisor Office'] = new Reference.location(dept.location);
					content[departmentName+' courses'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'department': dept.abrv,
					});
					content[departmentName+' instructors'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'instructor': {
							'department': dept.abrv,
						},
					});
				}
				
				card.setup({
					title: dept.departmentName,
					subtitle: dept.abrv,
					icon: 'resource/card.icon.department.png',
					content: content,
				});
				
				if(card.isOpen() && pendingOnDrawAction) {
					card.onDraw();
				}
			}
		);
		
		Download.json("data/ucsb/directory.people@(`mined`='commserv',`department`='"+departmentName+"').json",
			function(json) {
				var people = json;
				
				var references = {
					'Administration': new Reference.administration(people),
				};
				
				card.setup({
					references: references,
				});
			}
		);
		
		var deck = false;
		
		var self = {
			create: function() {
			},
		};
		
		$.extend(card, {
			
			// what to do when this card is brought to the top of the stack
			onDraw: function() {
			},
		});
		
		self.create();
		
		CardDeck('stack').add(card);
		
		return card;
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
		toString: function() {
			return __func__+'()';
		},
		
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.warn.apply(console, args);
		},
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.error.apply(console, args);
		},
	});
})();





Benchmark.stop('gui.card.types.js','load');
/************************
** gui.omnibox.js
************************/
Benchmark.start('gui.omnibox.js');



/**
* public class OmniBox

* @description  Utilizes advanced threading techniques to perform expensive regular expression
*	 	searches on potentially large data sets. 
* @author		Blake Regalia
* @email		blake.regalia@gmail.com
*
**/
(function() {
	
	var __func__ = 'Omnibox';
	
	
	var instance = false;
	
	var domstr_results = 'omnibox-results';
	var domstr_results_shadow = domstr_results+'-shadow';
	var domstr_results_containers = domstr_results+'-containers';
	
	var OmniboxSearchLoop;
	
	var construct = function(dqs) {
		
		dqs = dojo['query'](dqs);
		if(!dqs.length) global.error('"',dqs,'" selector returned empty set');
		var dom = dqs[0];
		var dom_input = dojo['query']('input',dom);
		if(!dom_input.length) global.error('element does not contain an input node: ',dom);
		dom_input = dom_input[0];
		
		
		/**
		* private:
		**/
		var searchText = '';
		
		var inputPredictor = new InputPredictor();
		var dataManager = new SearchItems();
		
		var searchLoop = OmniboxSearchLoop;
		
		
		/**
		* protected:
		**/
		var self = {
			
			// prepare and execute a new search
			search: function () {
				var empty = !searchText.length;
				var display = empty? 'none': 'block';
				
				dojo['query']('.'+domstr_results_containers)['forEach'](function(elmt) {
					elmt['style']['display'] = display;
				});
				
				if(!empty) {
					searcher();
				}
			},
			
			
			// handle keyup events to make sure the predictor was right
			keyup: function(e) {
				if(e.target.value != searchText) {
					console.warn('prediction of "'+searchText+'" failed: "'+e.target.value+'"');
					searcher.interupt();
					searchText = e.target.value;
					self.search();
				}
			},
			
			
			// as soon as a keydown event occurs, begin searching
			keydown: function(e) {
				
				// interupt the search loop
				searcher.interupt();
				
				// if the [RETURN] key is hit
				if(e.keyCode == 13) {
					var link = dojo['attr'](dojo['byId'](domstr_results)['childNodes'][0],'link');
					
					if(link) {
						dataManager.lookup(link);
					}
					else {
						SearchQuery(searchText, function(something) {
							if(something.isLocation) {
								something.execute();
							}
						});
					}
					return;
				}
				
				// calculate the new text based on this keydown event
				var prediction = inputPredictor(e);
				
				// if it is different than the current text
				if(prediction !== searchText) {
					
					// update our record of the search text
					searchText = prediction;
				
					// (re)start the search
					self.search();
				}
			},
			
			
			// string building the list's HTML has shown to be ~85% faster than dynamically creating each element
			handle_results: function(tiers) {
				var c = 0;
				var b = '<div id="'+domstr_results+'" class="'+domstr_results_containers+'">';
				for(var x=0; x<=tiers.max; x++) {
					if(tiers[x]) {
						var tier = tiers[x];
						var i = tier.length;
						while(i--) {
							var match_key = tier[i];
							var result = dataManager.get(match_key);
							var string = result.string;
							var show = string? string.substr(0,x)+'<b>'+string.substr(x,searchText.length)+'</b>'+string.substr(x+searchText.length): '';
							b += '<div class="search-result" link="'+match_key+'"><span class="title">'+show+'</span><span class="class">'+result.classTitle+'</span></div>';
							c += 1;
						}
					}
				}
				
				if(c == 0) {
					b += '<div class="search-result">'
							+'<span class="title"></span>'
							+'<span class="class">press enter to search</span>'
						+'</div>';
					c = 1;
				}
				
				b += '</div>';
				dojo['place'](b, domstr_results, 'replace');
				
				var listHeight = (c*20);
				if(listHeight > 200) {
					listHeight = 200;
				}
				dojo['byId'](domstr_results)['style']['height'] = listHeight+'px';
				var shadow_offset = CSS('header.space.y').pixels()-(CSS('omnibox.top').pixels()+CSS('omnibox.space.y').pixels());
				var shadow_height = Math.max(0, listHeight - shadow_offset);
				dojo['byId'](domstr_results_shadow)['style']['height'] = shadow_height+'px';
				dojo['byId'](domstr_results_shadow)['style']['display'] = (shadow_height == 0)? 'none': 'block';
				
				self.bind_actions(tiers);
			},
			
			
			bind_actions: function(tiers) {
				setTimeout(function() {
					var et = new Timer();
					dojo['query']('.search-result')
						['forEach'](function(tag) {
							dojo['connect'](tag,'onclick',function() {
								dataManager.lookup(dojo['attr'](this,'link'));
							});
						});
					console.info(global,': binding took '+et()+'ms');
				}, 0);
			},
			
		};
		
		
		// NOW declare the threaded search loop so it can reference the handler function
		var searcher = new ThreadedLoop(searchLoop, {
			cycleTime: 10,
			breatheTime: 0,
			data: {
				cycles: 0,
				index: 0,
				major: 0,
				power: 0,
				items: {},
				tiers: {max:0},
				text: '',
				handler: self.handle_results,
				dataManager: dataManager,
			},
			beforeStart: function() {
				this.data.text = searchText;
				this.data.items = dataManager.items(0);
			},
		});
		
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
		});
		
		
		// register key events on the input element
		dojo['connect'](dom_input, 'onkeyup', self.keyup);
		dojo['connect'](dom_input, 'onkeydown', self.keydown);
		
		// steal any stray keystrokes that bubble up to the document
		dojo['connect'](document, 'onkeydown', function() {
			dom_input.focus();
		});
		
		// listen for any stary mouse clicks that bubble up to the document
		dojo['connect'](document, 'click', function() {
			
		});
		
		return operator;
		
	};
	
	
	
	var global = window[__func__] = function() {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
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
	
	
	
	OmniboxSearchLoop = function() {
		
			// get reference to the loop data
			var loop = this.data;
			
			// increment loop cycle counter
			loop.cycles += 1;
			
			// reference loop data locally
			var i     = loop.index;
			var I     = loop.major;
			var power = loop.power;
			var items = loop.items;
			var tiers = loop.tiers;
			var text  = loop.text;
			var datam = loop.dataManager;
			
			var textLength = text.length;
			
			
			var regText = text.replace('.', '\\.');
			
			var a = new RegExp('^'+regText,'i');
			
			var b = new RegExp('[ \\.\\-_]'+regText,'i');
			
			/**
			var splitText = text.toUpperCase().split('');
			var c = new RegExp('\\b'+splitText.join('[^ ]*')+'[^ ]+\\b');
			
			// (([^ \-]*[ -]+)*e[^ -]*)
			var d = new RegExp('\\b('+splitText.join('[^ \\-]*)(([^ \\-]*[ \\-]+)*')+'[^ \\-]*)', 'i');
			
			**/
			
			var comparisons = 0;
			
			// while the thread runs
			while(this.runs()) {
				
				// keep track of how many strings are tested
				comparisons += 1;
				
				// reference the string (subject)
				var test = items[i];
				var az, bz, cz, dz;
				
				// attempt to match the best regex
				if(az=a.exec(test)) {
					var azi = az.index;
					if(!tiers[azi]) {
						tiers[azi] = [];
					}
					tiers[azi].push(power+i);
					
					// ~5% faster than calling Math.max
					if(azi > tiers.max) {
						tiers.max = azi;
					}
				}
				else if(bz=b.exec(test)) {
					var bzi = bz.index+1;
					if(!tiers[bzi]) {
						tiers[bzi] = [];
					}
					tiers[bzi].push(power+i);
					
					// ~5% faster than Math.max
					if(bzi > tiers.max) {
						tiers.max = bzi;
					}
				}
				
				i += 1;
				if(i === items.length) {
					i = 0;
					
					do {
						I += 1;
						
						if(I === datam.size()) {
							console.info(global,': search took ',loop.cycles,' cycles in ',Benchmark.highlight(((new Date()).getTime()-loop.start_time)+'ms'));
							loop.handler(tiers);
							return this.die();
						}
						
						power = datam.power(I);
						items = datam.items(I);
						
					} while(!items.length);
				}
			}
			
			// store the value of the index back to the loop data
			loop.index = i;
			loop.major = I;
			loop.power = power;
			loop.items = items;
			loop.tiers = tiers;
			
			// continue executing this loop
			this.cycle();
	};
	
})();
Benchmark.stop('gui.omnibox.js','load');
/************************
** define.esri-map.js
************************/
Benchmark.start('define.esri-map.js');

window['UCSB_Campus_earth'] = {
	basemap: {
		url: 'http://earth.geog.ucsb.edu/ArcGIS/rest/services/icmBaseMap/MapServer',
	},
	extent: {
		'xmin': -119.86100,
		'ymin': 34.40856,
		'xmax': -119.83553,
		'ymax': 34.41913,
		'spatialReference': {
			'wkid': 42306,
		},
	},
};

window['UCSB_Campus_ags2'] = {
	basemap: {
		url: 'http://ags2.geog.ucsb.edu/ArcGIS/rest/services/icmBaseMap20120413/MapServer',
	},
	extent: {
		xmin: -13342700,
		ymin: 4084100,
		xmax: -13339988,
		ymax: 4084700,
		spatialReference: {
			wkid: 102100,
		},
	},
};

window['UCSB_Campus_map'] = {
	basemap: {
		url: 'http://map.geog.ucsb.edu:8080/arcgis/rest/services/icm/basemap/MapServer',
	},
	extent: {
		'xmin': -13342700,
		'ymin': 4084100,
		'xmax': -13339988,
		'ymax': 4084700,
		'spatialReference': {
			'wkid': 102100,
		},
	},
};

window['DefaultPackage'] = UCSB_Campus_map;

/** static class EsriMap
*
*/
(function() {
	var __func__ = 'EsriMap';
	var dom = false;
	var map = false;
	var listeners = [];
	var coordinateSystem = new esri['SpatialReference']({'wkid': 4326});
	
	
	var highlightLayer = new esri['layers']['GraphicsLayer'](); 
	
	var self = {
		
	};
	var global = window[__func__] = function(package) {
		Benchmark.start(global);
		
		dom = dojo['byId']('map');
		
		$.style(dom, 'width',
			dojo['position'](document.body)['w'] - CSS('widgetMenu.space.x').pixels()
		);
		
		$.style(dom, 'height',
			dojo['position'](document.body)['h'] - CSS('header.space.y').pixels()
		);
		
		map = new esri['Map']('map', {
			extent: new esri['geometry']['Extent'](package.extent),
		});
		
		global.server = package.basemap.url;
		
		// Add Basemap
		map['addLayer'](
			new esri['layers']['ArcGISTiledMapServiceLayer'](package.basemap.url)
		);
		
		// Add highlight layer
		map['addLayer']( highlightLayer );
		
		var i = listeners.length;
		while(i--) {
			listeners.pop().apply(map, [dom]);
		}
		
		// map onload event
		dojo['connect'](map, 'onLoad', function() {
			Benchmark.mark('map load', global);
			Benchmark.mark('map load', 'script');
			Benchmark.save('load');
			
			// resize map on window resize event
			dojo['connect'](dom, 'resize', map, map['resize']);
		});
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		// for developers to test scripts
		getMap: function() {
			return map;
		},
		getDOM: function() {
			return dom;
		},
		ready: function(callback) {
			listeners.push(callback);
		},
		
		
		setCenter: function(webMercatorCoordinatePair) {
			console.log(webMercatorCoordinatePair);
			var point = new esri['geometry']['Point'](webMercatorCoordinatePair.x, webMercatorCoordinatePair.y, coordinateSystem);
			map['centerAt'](point);
		},
		
		focus: function(wmcp) {
			global.setCenter(wmcp.getPoint());
			var ext = wmcp.getExtent();
			var extent = new esri['geometry']['Extent'](ext[0], ext[1], ext[2], ext[3], coordinateSystem);
			
			var outline = new esri['symbol']['SimpleLineSymbol'](esri['symbol']['SimpleLineSymbol']['STYLE_SOLID'], new dojo['Color']([255, 215, 0, 1]), 3);
			var symbol = new esri['symbol']['SimpleFillSymbol'](esri['symbol']['SimpleFillSymbol']['STYLE_SOLID'], outline, new dojo['Color']([255, 215, 0, 0.5]));
			var extGraphic = new esri['Graphic'](ext, symbol);
			
			highlightLayer['add'](extGraphic);
			
			map['addLayer'](highlightLayer);
			
			/*
			var featureSet = new esri['tasks'].FeatureSet();
			featureSet.features = [extGraphic];
			*/
		},
	});
})();

Benchmark.stop('define.esri-map.js','load');
/************************
** define.search-items.js
************************/
Benchmark.start('define.search-items.js');


(function() {
	
	var __func__ = 'SearchItems';
	var instance = false;
	
	var subjects = {
		'Building': {
			url: 'data/ucsb/facilities.building#<[`buildingName`].json',
			select: Building.newCard('`buildingName`'),
		},
		'Department': {
			url: 'data/ucsb/directory.department.academic#<[`departmentName`].json',
			select: Department.newCard,//('`department`'),
		},
		'Undergrad Lecture': {
			url: 'data/ucsb/registrar.lecture.undergrad#<[`courseTitle` - `fullTitle`]$.json',
			select: function(){}, //Lectures.lookup('lecture.undergrad'),
		},
		'Graduate Lecture': {
			url: 'data/ucsb/registrar.lecture.graduate#<[`courseTitle` - `fullTitle`]$.json',
			select: function() {}, //Lectures.lookup('lecture.graduate'),
		},
		'Contact': {
			url: 'data/ucsb/directory.people#<[`firstName` `lastName`].json',
			select: Contact.newCard('`firstName` `lastName`'),
		},
	};
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		
		var itemClass = {};
		var listSize = 0;
		var matrix_width = 0;
		var ready = false;
		
		
		/**
		* protected:
		**/
		var self = {
			
			/**
			* NOT IN USE: intended for constant-sized maps
			**
			reduce: function(key) {
				var major = 0;
				while(key > matrix_width) {
					major += 1;
					key -= matrix_width;
				}
				return {
					major: major,
					minor: key,
				};
			},
			/***/
			
			expand: function(key) {
				var count = 0, pcount = 0;
				for(var e in itemClass) {
					count += itemClass[e].data.length;
					if(key < count) {
						return {
							major: parseInt(e),
							minor: key - pcount,
						};
					}
					pcount = count;
				}
				return console.error('SearchItems(): index out of bounds, '+key);
			},
		};
		
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			items: function(index) {
				return itemClass[index].data;
			},
			
			size: function() {
				return listSize;
			},
			
			power: function(key) {
				var c = 0;
				for(var e in itemClass) {
					if(!key--) break;
					c += itemClass[e].data.length;
				}
				return c;
			},
			
			get: function(key) {
				var count = 0, pcount = 0;
				for(var e in itemClass) {
					count += itemClass[e].data.length;
					if(key < count) {
						return {
							string: itemClass[e].data[key-pcount],
							classTitle: itemClass[e].title,
						}
					}
					pcount = count;
				}
				return console.error('SearchItems(): index out of bounds, '+key);
			},
			
			lookup: function(key) {
				var crd = self.expand(key);
				var set = itemClass[crd.major];
				var str = set.data[crd.minor];
				set.select.apply(set.select, [str.replace("'","\\'")]);
				return str;
			},
			
			expose: function() {
				return itemClass;
			},
			
			expand: function(key) {
				return self.expand(key);
			},
		});
		

		/**
		*
		**/
		var subjectUrls = {};
		for(var e in subjects) {
			subjectUrls[e] = subjects[e].url;
		}
		
		Download.json({
			
			urls: subjectUrls,
			
			each: function(key, json) {
				
				var pi = listSize++;
				
				itemClass[pi] = {
					data: json,
					title: key,
					select: subjects[key].select,
				};
			},
			
			ready: function() {
				ready = true;
				console.info('Search Items finished downloading');
			},
			
		});
		
		
		return operator;
		
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
Benchmark.stop('define.search-items.js','load');
/************************
** service.search-query.js
************************/
Benchmark.start('service.search-query.js');
(function() {
	
	var __func__ = 'SearchQuery';
	
	var xhr = false;
	
	var queries = {};
	
	
	var construct = function(str, callback) {
		
		/**
		* private:
		**/
		var value = false;
		
		var testLocation = new Location(str);
		if(testLocation.resolved) {
			value = testLocation;
		}
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			callback: function() {
				if(value) {
					callback.apply(callback, [value]);
				}
			},
		});
		
		if(value) {
			operator.callback();
		}
		else {
			if(xhr) {
				xhr.cancel();
			}
			xhr = Download.json('/service/search/'+str,
				function(json) {
					xhr = false;
					callback.apply(callback, [json]);
				}
			);
		}
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(str) {
		
		// if this search was made already, or is cached
		if(queries[str]) {
			instance = queries[str];
			instance.callback();
		}
		else {
			instance = construct.apply(this, arguments);
			queries[str] = instance;
		}
		return instance;
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
Benchmark.stop('service.search-query.js','load');
/************************
** dom.ready.js
************************/
Benchmark.start('dom.ready.js');


function projectToWM(lat, lng) {
	var source = new Proj4js.Proj('EPSG:4326');
	var dest = new Proj4js.Proj('EPSG:900913');
	var tran = new Proj4js.Point(lng, lat);   //any object will do as long as it has 'x' and 'y' properties
	Proj4js.transform(source, dest, tran);
	
	return tran;
}

dojo['addOnLoad'](function() {
	new EsriMap(DefaultPackage);
	new Omnibox('#omnibox');
	new CardDeck('stack', dojo['byId']('info-deck'));
	new Map();
});
Benchmark.stop('dom.ready.js','load');Benchmark.stop("all scripts","load");$.extend(window["CSS"],{"body":{"width":"100%","height":"100%","margin":"0","padding":"0","overflow":"hidden","fontFamily":"Helvetica, Arial, Sans-serif"},"flush":{"position":"fixed","width":"100%","height":"100%","left":"0","top":"0","overflow":"hidden"},"content":{"position":"absolute","width":"100%","height":"100%"},"header":{"position":"absolute","width":"100%","height":"84px","margin":"auto","padding":"0","$borderTopWidth":"1","$borderBottomWidth":"1","$borderColor":"#2E2E2E","borderTop":"1px solid #2E2E2E","bottomBottom":"1px solid #2E2E2E","backgroundColor":"#ECE8FF","background":"Array","filter":"progid:DXImageTransform.Microsoft.gradient( startColorstr=\"#b8e1fc\", endColorstr=\"#aca9ba\",GradientType=0 )","$boxShadow":"0 0 10px 4px ","boxShadow":"0 0 10px 4px #2C2C2C","zIndex":"64","zValues":{"guiObject":"72"},"space":{"y":"86px"},"focus":{"boxShadow":"0 0 10px 4px orange"},"corner":{"position":"absolute","width":"62%","height":"100%","right":"0","bottom":"0"}},"campusLogo":{"position":"absolute","right":"56.5","bottom":"12"},"widgetMenu":{"position":"fixed","width":"116px","height":"1000px","left":"0","top":"84px","borderWidth":"1px","borderStyle":"solid","borderColor":"black","space":{"x":"118px"},"backgroundColor":"white","pane":{"borderBottom":"1px solid black"},"icon":{"position":"relative","width":"100%","height":"82px","border":"1px solid black","backgroundRepeat":"no-repeat","backgroundPosition":"center","cursor":"pointer","boxShadow":"inset 0 0 16px -4px black","hover":{"backgroundColor":"rgba(237,236,238,0.8)","boxShadow":"inset 0 0 32px -4px black","span":{"display":"block"}},"overlay":{"position":"absolute","width":"100%","top":"52px","textAlign":"center","borderTop":"1px solid black","borderBottom":"1px solid black","color":"white","fontFamily":"trebuchet ms","backgroundColor":"rgba(64,66,65, 0.7)","display":"none"}}},"card":{"position":"absolute","width":"100%","height":"100%","left":"0","top":"0","marginTop":"10px","backgroundColor":"rgba(26, 15, 0, 0.9)","border":"3px solid black","borderRadius":"20px 40px 40px 40px","transformStyle":"preserve-3d","transition":"all 0.8s ease-out","container":{"position":"absolute","width":"60%","height":"80%","left":"0","top":"0","maxHeight":"600px","transition":"all 0.5s ease-out"},"icon":{"position":"absolute","width":"45px","height":"40px","left":"0","top":"0","borderBottom":"1px solid gray","borderRight":"1px solid gray","borderRadius":"10px 0 10px 0","backgroundColor":"rgba(255,255,255,0.2)"},"header":{"fontFamily":"helvetica","color":"white","textAlign":"center","separator":{"width":"100%","height":"2px","backgroundColor":"rgba(240,231,250, 0.2)"}},"title":{"color":"white","fontSize":"26pt","display":"block","marginLeft":"50px","textAlign":"left"},"subtitle":{"color":"white","fontSize":"18pt","display":"block"},"content":{"color":"darkGray","padding":"12px","text":{"color":"burlyWood"},"image":{"width":"90%","height":"200px","marginLeft":"auto","marginRight":"auto","marginTop":"5%","textAlign":"center","fontSize":"14pt","color":"black","backgroundColor":"transparent"}}},"cardDeck":{"info":{"position":"fixed","width":"30%","height":"100%","minWidth":"250px","right":"0","top":"0","marginTop":"86px","perspective":"450px","zIndex":"71"},"view":{"left":"50%","cursor":"pointer","opacity":"0.9","userSelect":"none","transform":"scale(0.6)","hover":{"transform":"rotateZ(-5deg) scale(0.612) translate(-19px, -30px)"},"card":{"border":"3px solid black","backgroundColor":"rgba(50, 50, 36, 1)","settled":{"hover":{"opacity":"1","border":"3px solid orange","backgroundColor":"rgba(20, 10, 0, 0.8)"}}}}},"map":{"position":"absolute","width":"auto","height":"auto","left":"118px","top":"86px","margin":"auto","padding":"0","borderColor":"#243C5F"},"omnibox":{"position":"absolute","width":"38%","height":"33.6px","left":"12px","top":"25.2px","input":{"width":"100%","height":"100%","padding":"0 0","borderWidth":"1px","borderStyle":"solid","borderColor":"black","fontSize":"100%","fontFamily":"Verdana,Sans-serif","textIndent":"5pt"},"space":{"y":"35.6px"},"zIndex":"128","results":{"position":"absolute","width":"100%","height":"200px","padding":"0 6px","backgroundColor":"white","borderTopWidth":"1px","borderTopStyle":"solid","borderTopColor":"rgba(128,128,128,0.36)","borderTop":"1pxsolidrgba(128,128,128,0.36)","$borderOther":"1px solid grey","borderLeft":"1px solid grey","borderRight":"1px solid grey","borderBottomWidth":"1px","borderBottom":"1px solid grey","overflowY":"scroll","opacity":"0.8","space":{"y":"202px"},"zIndex":"126","shadow":{"position":"fixed","width":"38%","height":"174.8px","top":"84px","left":"12px","paddingRight":"12px","border":"1px solid grey","borderTop":"1pxsolidrgba(128,128,128,0.36)","boxShadow":"0 0 32px 4px black","zIndex":"62"}},"searchResult":{"cursor":"pointer","hover":{"backgroundColor":"LightGoldenRodYellow"}}}});