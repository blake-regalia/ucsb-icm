


// BuildingCard extends Card
(function() {
	var __func__ = 'BuildingCard';
	
	var construct = function(bid) {
		
		var card = new Card('building:'+bid);
		
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		var pendingOnDrawAction = false;
		
		dojo.xhrGet({
			url: "data/ucsb.facilities.building@(`buildingId`)="+bid+".json",
			handleAs: 'json',
			load: function(json) {
				var bldg = json[0];
				
				var references = {};
				
				card.setup({
					title: bldg.buildingName,
					subtitle: bldg.buildingAbrv,
					icon: 'resource/card.icon.building.png',
					content: {
					},
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
		
		dojo.xhrGet({
			url: 'data/ucsb.registrar.lecture'+"%2523[`courseTitle`='"+courseTitle+"'].json",
			handleAs: 'json',
			load: function(json) {
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













// ContactCard extends Card
(function() {
	var __func__ = 'ContactCard';
	
	var construct = function(fullName) {
		
		var card = new Card('contact:'+fullName);
		
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		var pendingOnDrawAction = false;
		
		dojo.xhrGet({
			url: "data/ucsb.directory.people@(`firstName` `lastName`)="+fullName.replace("'","\\'")+".json",
			handleAs: 'json',
			load: function(json) {
				contact = json[0];
				
				var references = {};
				if(contact.instructs.length) {
					references = {
						'Instructs': new Reference.course(String.splitNoEmpty(contact.instructs)),
					};
				}
				
				card.setup({
					title: contact.firstName+' '+contact.lastName,
					subtitle: contact.title,
					icon: 'resource/card.icon.contact.jpg',
					content: {
						'Department': new Reference.department(contact.department),
						'Title': contact.title,
						'Email': new Reference.email(contact.email),
					},
					image: {
						google: {
							demo: (contact.firstName.toLowerCase() == 'blake' && contact.lastName.toLowerCase() == 'regalia')? true: false,
							args: [contact.firstName+' '+contact.lastName],
						},
						url: 'http://www.excursionclubucsb.org/Excursion_Club_at_UCSB/bio/blake.jpg',
					},
					references: references,
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
		
		dojo.xhrGet({
			url: "data/ucsb.directory.department@(`departmentName`)="+departmentName+".json",
			handleAs: 'json',
			load: function(json) {
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
			},
		});
		
		dojo.xhrGet({
			url: "data/ucsb.directory.people@(`mined`;`department`)=commserv;"+departmentName+".json",
			handleAs: 'json',
			load: function(json) {
				var people = json;
				
				var references = {
					'Administration': new Reference.administration(people),
				};
				
				card.setup({
					references: references,
				});
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




