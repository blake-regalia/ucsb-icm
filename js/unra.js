Benchmark.start('unra.js');

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




window.$ = window.jQuery? window.jQuery: {
	extend: Object.extend,
	style: Object.css.style,
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
	var global = window.Timer = function() {
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

Benchmark.stop('unra.js','load');