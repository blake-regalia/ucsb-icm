/**
*
* public class BuildingCard extends Card
*
**/
(function() {
	
	var __func__ = 'BuildingCard';
	
	
	
	var construct = function(building) {
		
		// super's constructor
		var card = new Card('building:'+building.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = building();
		var references = {};
		
		// setup the format of the card
		card.setup({
			title: raw.buildingName,
			subtitle: raw.buildingAbrv,
			icon: 'resource/card.icon.building.png',
			content: {
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
			
			// must be over-ridden
			onDraw: function(){},
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