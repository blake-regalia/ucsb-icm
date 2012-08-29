

(function() {
	var __func__ = 'CardDeck';
	
	var own = {};
	
	var css = {
		card_spacing: 36,
		deck_top: -100,
	};
	
	var construct = function(key, deck_dom) {
		
		var my = {
			zindex_base: 2048,
			zindex_plus: 0,
			card_drawn: false,
		};
		var stack = [];
		var top = -1;
		
		var self = {
			
		};
		
		var operator = function() {
		};
		
		$.extend(operator, {
			
			
			// add a card to the top of the deck
			add: function(card) {
				
				// if the card on top is open
				if(top !== -1 && stack[top].isOpen()) {
					// fold the card on top
					operator.fold(top);
				}
				
				// push it to the end of the array
				top = stack.push(card) - 1;
				
				// store this card's index to itself
				card.index = top;
				
				// reference the dom element of the container
				var card_dom = card.getElement();
				
				// set the appropriate zindex, relative to the other cards in this deck
				operator.ztop(card_dom);
				
				// append the card to this container
				deck_dom.appendChild(card_dom);
				
				// register stack-like dom events to this card
				operator.draw(top);
			},
			
			
			// fold a card with the given index
			fold: function(index) {
				var card = stack[index];
				
				// reference the dom element of the bounding element
				var card_dom = card.getElement();
				
				dojo['addClass'](card_dom , 'card_deckview');
				
				var translate_y = index * css.card_spacing + css.deck_top;
				$.style(card_dom , 'margin-top', translate_y+'px');
				
				card.fold();
				operator.ztop(card_dom);
				
				card.click(function() {
					this.unbind();
					operator.draw(this.getIndex());
				});
				
				setTimeout(function() {
					if(!card.isOpen()) {
						dojo['addClass'](card_dom, 'settled');
					}
				}, 600);
				
				my.card_drawn = false;
				
				card.onFold();
			},
			
			
			// draw a folded card from the stack, bring it to the top
			draw: function(index) {
				
				if(typeof index !== 'number') {
					return global.error('draw method requires index argument to be integer');
				}
				if(index < 0 || index > stack.length) {
					global.error(index,' is out of bounds for ',stack);
				}
				
				if(my.card_drawn) {
					operator.fold(top);
				}
				
				var card = stack[index];
				var card_dom = card.getElement();
				
				card.open();
				card.index = operator.pull(index);
				
				dojo['removeClass'](card_dom , 'card_deckview');
				dojo['removeClass'](card_dom , 'settled');
				
				$.style(card_dom , 'margin-top', '0');
				
				card.click(function() {
					this.unbind();
					operator.fold(this.getIndex());
				});
				
				my.card_drawn = true;
				
				card.onDraw();
			},
			
			
			// swap the indicies of two cards in the stack
			swap: function(a, b) {
				Array.swap.apply(stack, [a, b]);
			},
			
			
			// pull the given card to the top of the stack
			pull: function(index) {
				
				stack.push(stack.splice(index, 1)[0]);
				
				for(var i=index; i<top; i++) {
					stack[i].index = i;
					var card_dom = stack[i].getElement();
					$.style(card_dom, 'margin-top',
						(parseInt($.style(card_dom, 'margin-top')) - css.card_spacing) + 'px'
					);
					dojo['removeClass'](card_dom, 'settled');
					setTimeout((function() {
						var elmt = this.card_dom;
						return function() {
							dojo['addClass'](elmt, 'settled');
						}
					}).apply({card_dom:card_dom}), 600);
				}
				
				operator.ztop(stack[top].getElement());
				
				return top;
			},
			
			
			// sets the zindex of the given element to be the top of this stack
			ztop: function(card_dom) {
				card_dom['style']['zIndex'] = my.zindex_base + my.zindex_plus++;
			},
			
			
			// remove a card from the deck
			discard: function() {
				
			},
			
			
			// compress the view of the deck
			close: function() {
				
			},
			
			
			// spread the view of the deck
			spread: function() {
				
			},
			
			
			// toggle the view between closed and spread
			toggle: function() {
				
			},
			
			
			// reorder the cards based on a user-defined comparison function
			usort: function() {
				
			},
			
		});
		
		return operator;
	};
	
	
	
	var global = window[__func__] = function(key) {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			own[key] = instance;
			return instance;
		}
		else {
			if(own[key]) {
				return own[key];
			}
			else {
				global.error(key,' not found as entry');
			}
		}
	};
	
	
	
	$.extend(global, {
		
		toString: function() {
			return __func__+'()';
		},
		
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
	});
})();