/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

/**
*
* public class ContactCard extends Card
*
**/
(function() {
	
	var __func__ = 'LectureCard';
	
	
	
	var construct = function(lecture) {
		
		// super's constructor
		var card = new Card('lecture:'+lecture.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = lecture();
		var references = {};
		var location = new Location(raw.location);
		
		// resolve lecture location
		if(raw.location.length) {
			references['Location'] = new Reference.location(raw.location);
		}
		
		// resolve instructor
		if(raw.instructor.length) {
			references['Instructor'] = new Reference.contact(String.splitNoEmpty(raw.people,';'), raw.instructor);
		}
		
		// setup the format of the card
		card.setup({
			title: raw.courseTitle,
			subtitle: raw.fullTitle,
			icon: 'resource/card.icon.lecture.png',
			content: {
				'Subject': new Reference.subject(raw.subject),
				'Description': raw.description,
				'Days': raw.days,
				'Time': raw.time,
			},
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