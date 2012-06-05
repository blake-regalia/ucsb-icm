
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
		
		var lecture = false;
		var pendingOnDrawAction = false;
		
		dojo.xhrGet({
			url: 'data/get.php?k=registrar.'+level+'&v='+name,
			handleAs: 'json',
			load: function(json) {
				lecture = json;
				
				card.setup({
					title: lecture.courseTitle,
					subtitle: lecture.fullTitle,
					content: {
						'Description': lecture.description,
						'Days': lecture.days,
						'Time': lecture.time,
						'Instructor': lecture.instructor,
					},
					days: lecture.days,
					times: lecture.time,
				});
				
				if(card.isOpen() && pendingOnDrawAction) {
					card.onDraw();
				}
			},
		});
		
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
				console.log(lecture.location);
				var room = RoomLocator.search(lecture.location);
				if(room && room.exists) {
					EsriMap.setCenter(room.getPoint());
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