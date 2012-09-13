(function() {
	
	var __func__ = 'Color';
	
	var colorNames = {"aliceblue":15792383,"antiquewhite":16444375,"aquamarine":8388564,"azure":15794175,"beige":16119260,"bisque":16770244,"black":0,"blanchedalmond":16772045,"blue":255,"blueviolet":9055202,"brown":10824234,"burlywood":14596231,"cadetblue":6266528,"chartreuse":8388352,"chocolate":13789470,"coral":16744272,"cornflowerblue":6591981,"cornsilk":16775388,"cyan":65535,"darkgoldenrod":12092939,"darkgreen":25600,"darkkhaki":12433259,"darkolivegreen":5597999,"darkorange":16747520,"darkorchid":10040012,"darksalmon":15308410,"darkseagreen":9419919,"darkslateblue":4734347,"darkslategray":3100495,"darkturquoise":52945,"darkviolet":9699539,"deeppink":16716947,"deepskyblue":49151,"dimgray":6908265,"dodgerblue":2003199,"firebrick":11674146,"floralwhite":16775920,"forestgreen":2263842,"gainsboro":14474460,"ghostwhite":16316671,"gold":16766720,"goldenrod":14329120,"gray":8421504,"green":32768,"greenyellow":11403055,"honeydew":15794160,"hotpink":16738740,"indianred":13458524,"ivory":16777200,"khaki":15787660,"lavender":15132410,"lavenderblush":16773365,"lawngreen":8190976,"lemonchiffon":16775885,"lightblue":11393254,"lightcoral":15761536,"lightcyan":14745599,"lightgoldenrod":15654274,"lightgoldenrodyellow":16448210,"lightgray":13882323,"lightpink":16758465,"lightsalmon":16752762,"lightseagreen":2142890,"lightskyblue":8900346,"lightslate":8679679,"lightslategray":7833753,"lightsteelblue":11584734,"lightyellow":16777184,"limegreen":3329330,"linen":16445670,"magenta":16711935,"maroon":11546720,"mediumaquamarine":6737322,"mediumblue":205,"mediumorchid":12211667,"mediumpurple":9662683,"mediumseagreen":3978097,"mediumslateblue":8087790,"mediumspringgreen":64154,"mediumturquoise":4772300,"mediumviolet":13047173,"midnightblue":1644912,"mintcream":16121850,"mistyrose":16770273,"moccasin":16770229,"navajowhite":16768685,"navy":128,"oldlace":16643558,"olivedrab":7048739,"orange":16753920,"orangered":16729344,"orchid":14315734,"palegoldenrod":15657130,"palegreen":10025880,"paleturquoise":11529966,"palevioletred":14381203,"papayawhip":16773077,"peachpuff":16767673,"peru":13468991,"pink":16761035,"plum":14524637,"powderblue":11591910,"purple":10494192,"red":16711680,"rosybrown":12357519,"royalblue":4286945,"saddlebrown":9127187,"salmon":16416882,"sandybrown":16032864,"seagreen":3050327,"seashell":16774638,"sienna":10506797,"skyblue":8900331,"slateblue":6970061,"slategray":7372944,"snow":16775930,"springgreen":65407,"steelblue":4620980,"tan":13808780,"thistle":14204888,"tomato":16737095,"turquoise":4251856,"violet":15631086,"violetred":13639824,"wheat":16113331,"white":16777215,"whitesmoke":16119285,"yellow":16776960,"yellowgreen":10145074};
	
	var resolveConstructorArgs = new ArgumentResolver(
		'object obj'
	);
	
	var rgba = /^rgba?\s*\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*(?:,\s*([0-9\.]+))\)/;
	
	var black = {r:0,g:0,b:0,a:1};
	
	var resolveColor = function(str) {
		var m, v;
		if(str[0] === '#') {
			v = parseInt(str.substr(1), 16);
		}
		else if(v=colorNames[str.toLowerCase()]) {}
		else if((m=rgba.exec(str)) !== null) {
			return {
				r: parseInt(m[1]),
				g: parseInt(m[2]),
				b: parseInt(m[3]),
				a: m[4]? parseInt(m[4]): 1,
			};
		}
		else {
			return black;
		}
		return {
			r: (v >> 16),
			g: (v >> 8) & 0xFF,
			b: v & 0xFF,
			a: 1,
		};
	};
	
	
	var construct = function(obj) {
		
		/**
		* private:
		**/
		
		var r = obj.r;
		var g = obj.g;
		var b = obj.b;
		var a = obj.a;
		
		
		/**
		* protected:
		**/
		
		var rgba = function(p) {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = rgba;
		
		var hex = ((r<<16)|(g<<8)|b).toString(16);
		switch(hex.length) {
			case 0: hex = '0'+hex;
			case 1: hex = '0'+hex;
			case 2: hex = '0'+hex;
			case 3: hex = '0'+hex;
			case 4: hex = '0'+hex;
			case 5: hex = '0'+hex;
		}
		
		var strHex  = '#'+hex;
		var strRgb  = 'rgb('+r+','+g+','+b+')';
		var strRgba = 'rgba('+r+','+g+','+b+','+a+')';
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			isColor: true,
			
			alpha: a,
			hex: strHex,
			rgb: strRgb,
			rgba: strRgba,
			
			values: obj,
			
			toString: function() {
				return strRgba;
			},
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
		instance = construct.apply(this, arguments);
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
		
		
		// 
		of: function(str) {
			return global(resolveColor(str));
		},
	});
})();