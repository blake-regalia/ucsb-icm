/**
*
* public class RoomCard extends Card
*
**/
(function() {
	
	var __func__ = 'RoomCard';
	
	var highlightRoom = Room.highlight;
	
	var construct = function(room) {
		
		// super's constructor
		var card = new Card('room:'+room.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = room();
		var references = {};
		
		// setup the format of the card
		card.setup({
			title: room.title,
			subtitle: room.subtitle,
			icon: 'resource/card.icon.room.png',
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
			
			// fires when the card is drawn from the stack
			onDraw: function(){
				room.getExtent(function(geometry) {
					Map.add(
						{
							extent: geometry,
						},
						highlightRoom,
						'highlight',
						1
					).center({
						x: -CSS('cardDeck.info.width').pixels(
								dojo.position(document.body).w
							)*0.35,
						y: '-1%',
						expand: 2,
					});
				});
			},
			
			// fires when the card is being folded into the stack
			onFold: function() {
				Map.clear('highlight');
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