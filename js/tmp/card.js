var DomEventControl = function(link) {
	return {
		unbind: function() {
			dojo.disconnect(link);
		},
	};
};


/***

new CardDeck('stack', dojo.byId('info_deck'));

var courseId   = 'CS 185';
var courseName = 'Human-Computer Interaction';


var card = new Card(courseId+' - '+courseName, {
	title: courseId,
	subtitle: courseName,
	daysOfWeek: 'MW',
	timesOfDay: {
		A: [480, 530],
	},
	content: {
		'Description': 'This course offers blah blah blah...',
		'Instructor': instructor,
	},
});


CardDeck('stack').add(card);


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
				+'<div class="card-heading_separator"></div>'
				+'<div class="card-timeline">'
					+'<div class="card-timeline-days"></div>'
					+'<div class="card-timeline-times"></div>'
				+'</div>'
				+'<div class="card-references"></div>'
				+'<div class="card-heading_separator"></div>'
				+'<div class="card-content-image" style="display:none;"></div>'
				+'<div class="card-content"></div>'
			+'</div>';
	};
	
	
	var lowerAlphaNum = function(str) {
		return str.toLowerCase().replace(/[^\w]/g,'_');
	};
	
	
	var construct = function(key, setup) {
		
		
		var my = {
			
			id: cardId,
			
			viewStatus: global.OPEN,
			
			// create a div element
			dom: dojo.create('div', {
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
						return public.index;
					},
					unbind: function() {
						dojo.disconnect(my.eventListeners[eventListenerName]);
						my.eventListeners[eventListenerName] = false;
					},
				};
			},
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
			index: -1,
			
			// to be over-ridden by subclasses
			onDraw: function() {
				global.warn('onDraw meant to be over-ridden by extending subclass');
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
					dojo.disconnect(my.eventListeners.click);
					my.eventListeners.click = false;
				}
				my.eventListeners.click = dojo.connect(my.dom.firstChild, 'onclick', function() {
					method.apply(self.controlBinding('click'), arguments);
				})
			},
			
			toString: function() {
				return __func__+': '+key;
			},
			
		});
		
		
		// in case this was instantiated with the optional setup object
		public.setup(setup);
		
		
		return public;
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
				var e_dom = dojo.query('.card-header>.card-title', this.dom)[0];
				dojo.place('<span class="card-title">'+text+'</span>', e_dom, 'replace');
			},
			
			
			// creates a subtitle
			subtitle: function(text) {
				var e_dom = dojo.query('.card-header>.card-subtitle', this.dom)[0];
				dojo.place('<span class="card-subtitle">'+text+'</span>', e_dom, 'replace');
			},
			
			// sets the icon image
			icon: function(url) {
				var e_dom = dojo.query('.card-icon', this.dom)[0];
				dojo.place('<img src="'+url+'" height="40px"></img>', e_dom, 'last');
			},
			
			
			// creates a view to indicate days of the week
			days: function(dayString) {
				
				// referemce the target element
				var e_dom = dojo.query('.card-timeline>.card-timeline-days', this.dom)[0];
				
				
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
				dojo.place('<span class="card-timeline-days">'
						+'<div class="days-row">'+b+'</div>'
					+'</span>', e_dom, 'replace');
			},
			
			
			// creates a view to indicate times of the days specified
			times: function(obj) {
				
				
				// referemce the target element
				var e_dom = dojo.query('.card-timeline>.card-timeline-times', this.dom)[0];
				
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
				dojo.place('<span class="card-timeline-times">'
						+'<div class="times-row">'+b+'</div>'
						+'<div class="blocks-row">'+c+'</div>'
					+'</span>', e_dom, 'replace');
			},
			
			
			// fills the content view
			content: function(obj) {
				
				var e_dom = dojo.query('.card-content', this.dom)[0];
				
				// string builder for the content html
				var b = '';
				
				// iterate through the tags
				for(var each in obj) {
					
					// switch on the target
					var target = obj[each];
					switch(typeof target) {
						
						// simple html
						case 'string':
							dojo.place(
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
								dojo.place(
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
				var e_dom = dojo.query('.card-references', this.dom)[0];
				
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
					dojo.place(b, e_dom, 'last');
				}
				
			},
			
			// creates a view to indicate 1 graphic associated with this card
			image: function(obj) {
				//var e_dom = dojo.query('.card-content-image', this.dom, 'replace')[0];
				var e_dom = dojo.query('.card-content-image', this.dom)[0];
				e_dom.style.display = 'block';
				
				if(obj.google && !obj.google.demo) {
					GoogleImageSearch(obj.google.args[0], function(url) {
						var img = '<img src="'+url+'" style="max-width:320px; max-height:200px;"/>';
						dojo.place(img, e_dom);
					});
				}
				else if(obj.url) {
					var img = '<img src="'+obj.url+'" style="max-width:320px; max-height:200px;"/>';
					dojo.place(img, e_dom);
				}
			}
		},
	});
})();

