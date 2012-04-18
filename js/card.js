

// CardDeck
(function() {
	var __func__ = 'CardDeck';
	
	var deck_top = -80;
	var card_spacing = 35;
	var zindex_base = 2048;
	var zindex_plus = 0;
	
	var construct = function(deck_dom) {
		
		var stack = [];
		
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			push: function(card) {
				
				var index = stack.push(card) - 1;
				
				var element = card.getElement();
				element.style.zIndex = zindex_base + zindex_plus++;
				
				var i = index;
				var first = true;
				while(i--) {
					var elmt = stack[i].getElement();
					
					if(first) {
						first = false;
						dojo.addClass(elmt, 'card_deckview');
					}
					var translate_y = i * card_spacing + deck_top;
					$.style(elmt, 'margin-top', translate_y+'px');
				}
				
				return {
					
				};
			},
			
			getElement: function() {
				return deck_dom;
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




// Card
(function() {
	var __func__ = 'Card';
	
	var cardIdNum = 0;
	var zIndexBase = 2048;
	
	var insertCard = function(id, container) {
		var html = 
		  '<div id="'+id+'-container" class="card_container" style="z-index:'+zIndexBase+cardIdNum+';">'
			+'<div id="'+id+'" class="card">'
				+'<div class="card_title">'
				+'</div>'
			+'</div>'
		+'</div>';
		
		return dojo.place(html, container);
	};
	
	var construct = function(container) {
		
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
				}
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

ESRI_Map.ready(function() {
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
			},
		};
		
		$.extend(card, {
			
		});
		
		self.create();
		
		deck = infoDeck.push(card);
		
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