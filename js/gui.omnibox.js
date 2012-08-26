
window.SearchItems = {
	$map: [],
};

/** search regexes **

Abbreviated Terms
==========================
search: bdr
split search & for each char e, push to array: (e[^ \-]*|([^ \-]*[ -]+)+e[^ -]*)
join all via delimeter: [ \-]+
matches:
blake douglas regalia
blue-orange pieces of dodgy reeses


Shortened Terms
==========================
search: csi
/^c[^ ]*s[^ ]*i[^ ]+\b/
first character matches, next character appears before last character before word boundary
matches:
compscience
cmpsci-185
congressional



/******/


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
	
	var construct = function(dom_node) {
		
		var input_predictor = new InputPredictor();
		var search_text = '';
		
		var searchLoop = function() {
			
			// get reference to the loop data
			var loop = this.data;
			
			// increment loop cycle counter
			loop.cycles += 1;
			
			// reference loop data locally
			var i = loop.indexMinor;
			var mapIndex = loop.indexMajor;
			
			var text = loop.text;
			var tiers = loop.tiers;
			var items = loop.items;
			
			// get reference to the matches
			var matches = loop.matches;
			
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
			
			
			var power = SearchItems.power(mapIndex);
			
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
				
				var test = items[i];
				var az, bz, cz, dz;
				
				//var az = a.exec(test);
				//var bz = b.exec(test);
				
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
					console.log('finished: ',mapIndex,' / ',SearchItems.size());
					i = 0;
					
					do {
						mapIndex += 1;
						
						if(mapIndex === SearchItems.size()) {
							console.info(global,': search took ',loop.cycles,' cycles in ',Benchmark.highlight(((new Date()).getTime()-loop.start_time)+'ms'));
							self.handle_results(tiers);
							return this.die();
						}
						items = SearchItems.data(mapIndex);
						power = SearchItems.power(mapIndex);
						console.log('hey, mapIndex: ',mapIndex,' has ',items.length,' items.');
					} while(!items.length);
				}
			}
			
			
			console.log(i,' / ',items.length);
			
//			console.log('performed '+num_comparisons+' comparisons; index: '+i+'; length: '+length);
			
			// store the value of the index back to the loop data
			loop.indexMinor = i;
			loop.indexMajor = mapIndex;
			loop.tiers = tiers;
			
			console.log(loop);
			
			// continue executing this loop
			this.cycle();
		};
		
		var threaded_search = new ThreadedLoop(searchLoop, {
			cycleTime: 10,
			data: {
				cycles: 0,
				indexMajor: 0,
				indexMinor: 0,
				text: '',
				tiers: {max:0},
				items: SearchItems.data(0),
			},
			beforeStart: function() {
				this.data.text = search_text;
				this.data.results = false;
			},
		});
		
		
		var self = {
			search: function () {
				var empty = !search_text.length;
				var display = empty? 'none': 'block';
				
				dojo.query('.'+domstr_results_containers).forEach(function(elmt) {
					elmt.style.display = display;
				});
				
				if(!empty) {
					threaded_search();
				}
			},
			keyup: function(e) {
				if(e.target.value != search_text) {
					console.warn('prediction of "'+search_text+'" failed: "'+e.target.value+'"');
					threaded_search.interupt();
					search_text = e.target.value;
					self.search();
				}
			},
			keydown: function(e) {
				threaded_search.interupt();
				
				if(e.keyCode == 13) {
					var link = dojo.attr(dojo.byId(domstr_results).childNodes[0],'link');
					
					if(link) {
						SearchItems.lookup(link).execute();
					}
					else {
						SearchQuery(search_text);
					}
					return;
				}
				
				var prediction = input_predictor(e);
				
				if(prediction !== search_text) {
					search_text = prediction;
				
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
							var result = SearchItems.result(match_key);
							var string = result.string;
							var show = string? string.substr(0,x)+'<b>'+string.substr(x,search_text.length)+'</b>'+string.substr(x+search_text.length): '';
							b += '<div class="search-result" link="'+match_key+'"><span class="title">'+show+'</span><span class="class">'+result.class_title+'</span></div>';
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
				dojo.place(b, domstr_results, 'replace');
				
				var listHeight = (c*20);
				if(listHeight > 200) {
					listHeight = 200;
				}
				dojo.byId(domstr_results).style.height = listHeight+'px';
				var shadow_offset = CSS('header.space.y').pixels()-(CSS('omnibox.top').pixels()+CSS('omnibox.space.y').pixels());
				var shadow_height = Math.max(0, listHeight - shadow_offset);
				dojo.byId(domstr_results_shadow).style.height = shadow_height+'px';
				dojo.byId(domstr_results_shadow).style.display = (shadow_height == 0)? 'none': 'block';
				
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
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
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






Contacts = {
	lookup: function(fullName) {
		new ContactCard(fullName);
	},
};


// Lectures
(function() {
	var __func__ = 'Lectures';
	var construct = function() {
		var self = {
			
		};
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
		lookup: function(level) {
			return function(id) {
				new LectureCard(id.substr(0, id.indexOf(' - ')));
			};
		},
	});
})();


(function() {
	var __func__ = 'SearchQuery';
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function(query) {
		dojo.xhrGet({
			url: 'data/service.php?q='+query,
			handleAs: 'json',
			load: function(json) {
				console.log(json);
			},
		});
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		}
	});
})();