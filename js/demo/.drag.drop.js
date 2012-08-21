
(function() {
	var __func__ = 'DragDrop';
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
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


new Draggable(card_dom, {
	onDragStart: function(){},
	onDrag: function(){},
	onDrop: function(){},
	limit: {
		
	},
});