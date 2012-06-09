(function() {
	var __func__ = 'ParkingLotCard';
	
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



Widget.register('widget.action.main', function() {
	
	var self = this;
	
	self.setContentView(R.layout.parkingFilter);
	
	var filterSet = {
		motorycle: {
			dom: self.find('#motorcycle.filter'),
			criteria: {
				has: {
					field: 'motorcycle',
					value: true,
				},
			},
		},
		employee: {
			dom: self.find('#employee.filter'),
			criteria: {
				has: [
					{
						field: 'staff',
						value: true,
					},
					{
						field: 'faculty',
						value: true,
					},
				},
			},
		},
		visitor: {
			dom: self.find('#visitor.filter'),
			criteria: {
				has: [
					{
						field: 'visitor',
						value: true,
					},
					{
						field: 'student',
						value: true,
					},
				},
			},
		},
	};
	
	for(var filterName in filterSet) {
		var filter = filterSet[filterName];
		$(filter.dom).click(function(e) {
			e.preventDefault();
			var checkbox = $(this).find('input[type="checkbox"]');
			var checked = !checkbox.attr('checked');
			checkbox.attr('checked', checked);
			
			if(checked) {
				Layer.addFilter(filterName, filter.criteria);
			}
			else {
				Layer.removeFilter(filterName);
			}
		});
	}
	
	
});



Widget.register('widget.action.select', function(key) {
	var self = this;
	
	new ParkingLotCard(key);
});