











// DepartmentCard extends Card
(function() {
	var __func__ = 'DepartmentCard';
	
	var construct = function(departmentName) {
		
		var card = new Card('department:'+departmentName);
		
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		var pendingOnDrawAction = false;
		
		Download.json("data/ucsb/directory.department@(`departmentName`='"+departmentName+"').json",
			function(json) {
				dept = json[0];
				
				var content = {
					'Website': new Reference.website(dept.website),
				};
				if(dept.abrv) {
					content['Advisor Office'] = new Reference.location(dept.location);
					content[departmentName+' courses'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'department': dept.abrv,
					});
					content[departmentName+' instructors'] = new Reference.widget('edu.ucsb.geog.icm-widget.courses', {
						'instructor': {
							'department': dept.abrv,
						},
					});
				}
				
				card.setup({
					title: dept.departmentName,
					subtitle: dept.abrv,
					icon: 'resource/card.icon.department.png',
					content: content,
				});
				
				if(card.isOpen() && pendingOnDrawAction) {
					card.onDraw();
				}
			}
		);
		
		Download.json("data/ucsb/directory.people@(`mined`='commserv',`department`='"+departmentName+"').json",
			function(json) {
				var people = json;
				
				var references = {
					'Administration': new Reference.administration(people),
				};
				
				card.setup({
					references: references,
				});
			}
		);
		
		var deck = false;
		
		var self = {
			create: function() {
			},
		};
		
		$.extend(card, {
			
			// what to do when this card is brought to the top of the stack
			onDraw: function() {
			},
		});
		
		self.create();
		
		CardDeck('stack').add(card);
		
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
		},
		
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.warn.apply(console, args);
		},
		
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+': ');
			console.error.apply(console, args);
		},
	});
})();




