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
* public class BuildingCard extends Card
*
**/
(function() {
	
	var __func__ = 'DepartmentCard';
	
	
	var construct = function(department) {
		
		// super's constructor
		var card = new Card('department:'+department.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = department();
		var references = {};
		
		if(raw.location.length) {
			var location = new Location(raw.location);
		}
		
		// setup the format of the card
		card.setup({
			title: raw.departmentName,
			//subtitle: raw.,
			icon: 'resource/card.icon.department.png',
			content: {
			},
			/*
					content['Advisor Office'] = new Reference.location(dept.location);
					content[departmentName+' courses'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'department': dept.abrv,
					});
					content[departmentName+' instructors'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'instructor': {
							'department': dept.abrv,
						},
					});
			*/
			references: {
//				'Administration': new Reference.administration(people),
				//'Location': new Reference.location(raw.location),
			},
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
			
			// fires when the card is drawn from the stack
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
			
			// fires when the card is being folded into the stack
			onFold: function() {
				
			},
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