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
	
	var __func__ = 'ContactCard';
	
	
	
	var construct = function(contact) {
		
		// super's constructor
		var card = new Card('contact:'+contact.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = contact();
		var references = {};
		
		// resolve references to courses
		if(raw.instructs && raw.instructs.length) {
			references['Instructs'] = new Reference.course(String.splitNoEmpty(raw.instructs));
		}
		
		// resolve office location
		if(raw.location.length) {
			var location = new Location(raw.location);
			references['Office'] = new Reference.location(raw.location);
		}
		
		var iconType = 'contact';
		if(/professor/i.test(raw.title) || /lecture/i.test(raw.title)) {
			iconType = 'lecturer';
		}
		
		// setup the format of the card
		card.setup({
			title: contact.fullName,
			subtitle: String.splitNoEmpty(raw.title,';').join('<br/>'),
			icon: 'resource/card.icon.'+iconType+'.png',
			content: {
				'Department(s)': new Reference.department(raw.departments),
				'Title': String.splitNoEmpty(raw.title,';').join('<br/>'),
				'Email': new Reference.email(raw.email),
			},
			/*
			image: {
				google: {
					demo: (raw.firstName.toLowerCase() == 'blake' && raw.lastName.toLowerCase() == 'regalia')? true: false,
					args: [raw.firstName+' '+raw.lastName],
				},
				url: 'http://www.excursionclubucsb.org/Excursion_Club_at_UCSB/bio/blake.jpg',
			},
			*/
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
				if(location && location.resolved && location.isRoom) {
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