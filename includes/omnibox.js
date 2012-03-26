
window.SearchItems = {
	$map: [],
};

(function() {
	var __func__ = 'SearchItems';
	var classes = [];
	var table = {
		lookup: {},
	};
	
	
	// know how wide the arrays have to be in order for no collisions to occur
	var matrix_width = 0;
	
	// keep track of the download status' with 32-bit integers
	var download_status = 0;
	var download_full = 0;
	
	var self = {
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
		download: function(key, power) {
			dojo.xhrGet({
				url: 'data/'+key+'.json',
				handleAs: 'json',
				load: function(json) {
					
					// store the json data
					classes[power].data = json;
					
					if(json.length > matrix_width) {
						
						// round up to the nearest power of 2
						matrix_width = Math.pow(2,Math.ceil(Math.log(json.length)/Math.LN2));
						
						// OR this download status bit into place
						var bit = 1 << power;
						download_status |= bit;
						
						// if all the downloads are complete
						if(download_status === download_full) {
							self.downloads_ready();
						}
					}
				},
			});
		},
		downloads_ready: function() {
			console.log(global, classes);
		},
		update_classes: function() {
			var i=classes.length;
			while(i--) {
				var class_target = classes[i];
				switch(class_target.state) {
				// pending download
				case 0:
					class_target.state += 1;
					self.download(class_target.key, i);
					break;
				// downloading
				case 1:
					break;
				// okay
				case 2:
					break;
				}
			}
		},
	};
	var global = window[__func__] = function() {
		
	};
	$.extend(global, {
		add: function() {
			var len = arguments.length;
			if(len + classes.length > 32) {
				console.error(global,': item list length exceeded 32');
			}
			// traverse the list forward, must be done this way if this function can called more than once
			for(var i=0; i!==len; i++) {
				var arg = arguments[i];
				
				var power = classes.length;
				
				download_full |= 1 << power;
				
				// the front of the classes list has lowest priority, push later arguments to the front
				classes.unshift({
					key: arg.key,
					title: arg.title,
					state: 0,
				});
				
				table.lookup[arg.key] = {
					hash: power,
					select: arg.select || function(){}
				};
			}
			self.update_classes();
		},
		empty: function() {
			classes.length = 0;
			matrix_width = 0;
			download_status = 0;
			delete table.lookup;
			table.lookup = {};
			self.update_classes();
		},
		set: function() {
			global.empty();
			global.add.apply(this, arguments);
		},
		data: function(index) {
			return classes[index].data;
		},
		power: function(index) {
			return matrix_width * index;
		},
		size: function() {
			return classes.length;
		},
		result: function(key) {
			var index = self.reduce(key);
			var target = classes[index.major];
			return {
				string: target.data[index.minor],
				class_title: target.title,
			};
		},
		lookup: function(hash) {
			var index = self.reduce(hash);
			var target = classes[index.major];
			var string = target.data[index.minor];
			var origin = table.lookup[target.key];
			return {
				execute: function() {
					origin.select.apply(null, [string]);
				},
			};
		},
		expose: function() {
			return {
				classes: classes,
				matrix_width: matrix_width,
				table: table,
			};
		},
		toString: function() {
			return __func__+'()';
		}
	});
})();

window.Buildings = {
	lookup: function(obj) {
		console.log(obj);
	},
};

SearchItems.set(
	{
		key: 'building.names',
		title: 'Building',
		select: Buildings.lookup,
	},
	{
		key: 'test.names',
		title: 'Geog Person',
//		select: Contacts.lookup,
	},
	{
		key: 'professor.names',
		title: 'Professor',
	}
);

(function() {
	var __func__ = 'InputPredictor';
	var construct = function() {
		var self = {
			
		};
		var public = function(e) {
			var node = e.target;
			var phrase = node.value;
			
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
		
	});
})();


(function() {
	var __func__ = 'Omnibox';
	var construct = function(dom_node) {
		
		var input_predictor = new InputPredictor();
		var search_text = '';
		
		var threaded_search = new ThreadedLoop(function() {
			
			// get reference to the loop data
			var loop = this.loop;
			
			// increment loop cycle counter
			loop.cycles += 1;
			
			// fetch the value of the current index and length
			var map_index = loop.index_major;
			var i = loop.index_minor;
			
			var text = loop.text;
			
			// get reference to the matches
			var matches = loop.matches;
			var tiers = loop.sorted_tiers;
			
			var a = new RegExp('^'+text,'i');
			var b = new RegExp('[ \\.\\-_]'+text,'i');
			var c = new RegExp();
			
			var search = SearchItems.data(map_index);
			var power = SearchItems.power(map_index);
			
			/** HASHING **
			var hash = SearchItems['#'+section.key];
			
			if(hash[text]) {
				tiers = hash[text];
				self.handle_results(tiers);
				return this.die();
			}
			/**/
			
			var num_comparisons = 0;
			
			// while the thread runs
			while(this.runs()) {
				
				num_comparisons += 1;
				
				var match = search[i];
				
				var test = match;
				var az = a.exec(test);
				var bz = b.exec(test);
				
				if(az) {
					var azi = az.index;
					if(!tiers[azi]) {
						tiers[azi] = [];
					}
					tiers[azi].push(power+i);
					
					// ~5% faster than Math.max
					if(azi > tiers.max) {
						tiers.max = azi;
					}
				}
				else if(bz) {
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
				if(i === search.length) {
					i = 0;
					map_index += 1;
					
					if(map_index === SearchItems.size()) {
						console.info(global,': search took ',loop.cycles,' cycles in ',Benchmark.highlight(((new Date()).getTime()-loop.start_time)+'ms'));
						self.handle_results(tiers);
						return this.die();
					}
					search = SearchItems.data(map_index);
					power = SearchItems.power(map_index);
				}
			}
			
//			console.log('performed '+num_comparisons+' comparisons; index: '+i+'; length: '+length);
			
			// store the value of the index back to the loop data
			loop.index_minor = i;
			
			// continue executing this loop
			this.cycle();
		});
		
		threaded_search.setLoopData({
			index_major: 0,
			index_minor: 0,
			cycles: 0,
			sorted_tiers: {max:0},
		});
		threaded_search.onStart(function() {
			this.loop.text = search_text;
		});
		threaded_search.setCycleTime(10);
		
		
		var self = {
			keyup: function(e) {
				if(e.target.value != search_text) {
					console.warn('prediction of "'+search_text+'" failed: "'+e.target.value+'"');
				}
			},
			keydown: function(e) {
				threaded_search.interupt();
				
				var prediction = input_predictor(e);
				
				if(prediction !== search_text) {
					search_text = prediction;
				
					threaded_search();
				}
			},
			
			// string building the list's HTML has shown to be ~85% faster than dynamically creating each element
			handle_results: function(tiers) {
				var b = '<div id="search_results">';
				for(var x=0; x<=tiers.max; x++) {
					if(tiers[x]) {
						var tier = tiers[x];
						var i = tier.length;
						while(i--) {
							var match_key = tier[i];
							var result = SearchItems.result(match_key);
							var string = result.string;
							var show = string? string.substr(0,x)+'<b>'+string.substr(x,search_text.length)+'</b>'+string.substr(x+search_text.length): '';
							b += '<div class="search_result" link="'+match_key+'"><span class="title">'+show+'</span><span class="class">'+result.class_title+'</span></div>';
						}
					}
				}
				b += '</div>';
				dojo.place(b, 'search_results', 'replace');
				self.bind_actions(tiers);
			},
			bind_actions: function(tiers) {
				setTimeout(function() {
					var et = new Timer();
					dojo.query('.search_result')
						.forEach(function(tag) {
							dojo.connect(tag,'onclick',function() {
								SearchItems.lookup(dojo.attr(this,'link')).execute();
							});
						});
					console.info(global,': binding took '+et()+'ms');
				}, 0);
			},
		};
		
		/** dojo **/
		dojo.connect(dom_node, 'onkeyup', self.keyup);
		dojo.connect(dom_node, 'onkeydown', self.keydown);
		/** -/end/- **/
		
		var public = function() {
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
		toString: function() {
			return __func__+'()';
		},
	});
	
	/* setup DOM for the omnibox */
	dojo.ready(function() {
		var omnibox = dojo.byId('omnibox');
		
		// steal any stray keystrokes
		dojo.connect(document, 'onkeydown', function() {
			omnibox.focus();
		});
	});
})();