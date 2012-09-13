/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */




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