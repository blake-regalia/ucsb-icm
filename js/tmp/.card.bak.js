/***/

var courseId   = 'CS 185';
var courseName = 'Human-Computer Interaction';

/* Card widgets *
 - title
 - subtitle
 - daysOfWeek
 - timesOfDay
 - content
/**/

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

card.setup({
	
});

CardDeck('stack').add(card);



/***/

var randomColor = function() {
	return ['hsl(',
		Math.round(Math.random()*360),',',
		Math.round(Math.random()*70+30),'%,',
		Math.round(Math.random()*30+70),'%',
	')'].join('');
};


// Card
(function() {
	var __func__ = 'Card';
	
	var cardIdNum = 0;
	var zIndexBase = 2048;
	
	// reference the function to build the html of the card
	var insertCard = function(id, container) {
		var html = 
		  '<div id="'+id+'-container" class="card_container" style="z-index:'+(zIndexBase+cardIdNum)+';">'
			+'<div id="'+id+'" class="card">'
				+'<div class="card_title">'
				+'</div>'
				+'<div class="card_heading_separator"></div>'
				+'<div class="card_content"></div>'
			+'</div>'
		+'</div>';
		
		return dojo.place(html, container);
	};
	

	
	
	var construct = function(key, setup) {
		
		var card_id = 'card_'+(++cardIdNum);
		
		var container_dom = insertCard(card_id, container)
		var card_dom = dojo.byId(card_id);
		
		var html = '';
		
		var self = {
			
		};
		
		var public = function() {
			
		};
		
		$.extend(public, {
			
			title: function(which, text) {
				switch(which) {
					case 'heading':
						var card_title = dojo.query('.card_title', card_dom)[0];
						dojo.place('<span class="card_title_'+which+'">'+text+'</span>', card_title);
						break;
					case 'subheading':
						var card_title = dojo.query('.card_title', card_dom)[0];
						dojo.place('<span class="card_title_'+which+'">'+text+'</span>', card_title);
						break;
				}
			},
			
			content: function(obj) {
				var card_content = dojo.query('.card_content', card_dom)[0];
				
				var b = '';
				for(var e in obj) {
					var txt = (typeof obj[e] == 'string')? obj[e]: '<a href="#">'+obj[e].join('</a>, <a href="#">')+'</a>';
					b += '<div>'
							+'<span class="card-item">'+e+': </span>'
							+'<span class="card-text">'+txt+'</span>'
						+'</div>';
				}
				
				dojo.place(b, card_content);
			},
			
			image: function() {
				b += '<div class="card-image" style="background-color: '+randomColor()+';"><div>Image</div></div>';
				
				console.log(b);
				
				dojo.place(b, card_content);
			},
			
			getElement: function() {
				return card_dom;
			},
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
		}
	});
})();

EsriMap.ready(function() {
	window.infoDeck = new CardDeck(dojo.byId('info_deck'));
});



// BuildingCard extends Card
(function() {
	var __func__ = 'BuildingCard';
	
	var construct = function(name) {
		
		var card = new Card(infoDeck.getElement());
		var deck = false;
		
		var self = {
			create: function() {
				card.title('heading', name);
				card.content({
					'Hours': '7:00am - 11:00pm',
					'Phone': '(805) 893-7619',
					'Departments': ['Geography','Geology','Art History'],
				});
			},
		};
		
		$.extend(card, {
			
		});
		
		self.create();
		
		deck = infoDeck.push(card);
		
		dojo.connect(card.getElement(), 'onclick', function() {
			infoDeck.fold();
		});
		
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
		}
	});
})();



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
	
	var construct = function(level, name) {
		
		var card = new Card(level+':'+name);
		
		dojo.xhrGet({
			url: 'data/get.php?k=registrar.'+level+'&v='+name,
			handleAs: 'json',
			load: function(lecture) {
				
				
				
				card.title('heading', lecture.courseTitle);
				card.title('subheading', lecture.fullTitle);
				card.content({
					'Description': lecture.description,
					'Days': lecture.days,
					'Time': lecture.time,
					'Instructor': lecture.instructor,
				});
				
				RoomLocator.search(lecture.location);
			},
		});
		
		var deck = false;
		
		var self = {
			create: function() {
			},
		};
		
		$.extend(card, {
			
		});
		
		self.create();
		
		deck = infoDeck.push(card);
		
		dojo.connect(card.getElement(), 'onclick', function() {
			infoDeck.fold();
		});
		
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
		}
	});
})();