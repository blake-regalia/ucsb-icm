

// Card
(function() {
	var __func__ = 'Card';
	
	var cardIdNum = 0;
	
	var insertCard = function(id) {
		var html = '<div id="'+id+'" class="card">'
			+'<div class="card_title">'
			+'</div>'
		+'</div>';
		
		return dojo.place(html, dojo.byId('content'));
	};
	
	var construct = function() {
		
		var card_id = 'card_'+(++cardIdNum);
		
		var card_dom = insertCard(card_id);
		
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



// BuildingCard
(function() {
	var __func__ = 'BuildingCard';
	
	var construct = function(name) {
		
		var card = new Card();
		
		var self = {
			create: function() {
				card.title('heading', name);
			},
		};
		
		var public = function() {
			
		};
		
		$.extend(public, {
			
		});
		
		self.create();
		
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