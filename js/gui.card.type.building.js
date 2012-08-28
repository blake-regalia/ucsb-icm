/**
*
* public class BuildingCard extends Card
*
**/
(function() {
	
	var __func__ = 'BuildingCard';
	
	
	var highlightBuilding = new Symbol({
		fill: 'rgba(255,0,0,0.3)',
		stroke: {
			color: 'rgba(255,0,0,0.75)',
			style: 'solid',
			width: 3,
		},
	});
	
	
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
			
			// fires when the card is drawn from the stack
			onDraw: function(){
				building.getPolygon(function(geometry) {
					Map.add(
						{
							polygon: geometry,
						},
						highlightBuilding,
						'highlight',
						1
					).center({
						x: -CSS('cardDeck.info.width').pixels(
								dojo.position(document.body).w
							)*0.35,
						y: '-1%',
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