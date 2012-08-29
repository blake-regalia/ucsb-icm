(function() {
	var __func__ = 'Department';
	
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var operator = function() {
			
		};
		
		
		$.extend(operator, {
			
		});
		
		
		return operator;
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
		
		newCard: function(departmentName) {
			new DepartmentCard(departmentName);
		},
		
		toString: function() {
			return __func__+'()';
		}
		
	});
})();