(function() {
	
	var __func__ = 'Reference';
	
	
	// create the standard dom node for a reference
	var refer = function(args, html, tag) {
		
		if(!tag) tag = 'div';
		
		// assert the required attributes have values
		$.extend({
			title: '',
			class: '',
		}, args);
		
		
		// create the element & return it
		return dojo.create(tag, {
			class: args.class,
			innerHTML: args.title+html,
		});
	};
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		var public = function() {
			
		};
		
		$.extend(public, {
			isReference: true,
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
		
		
		contact: function(people, names) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				// reference the length of resolved contacts
				var i = people.length;
				
				// if there aren't any resolved names
				if(!i) {
					// use the backup names
					html = names;
				}
				else {
					html = [];
					while(i--) {
						// build elements for the links
						var fullName = people[i];
						html.push('<button link="'+fullName+'">'+fullName+'</button>');
					}
					// implode the html string array
					html = html.join('');
				}
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo.query('button', e_dom).forEach( function(elmt) {
					dojo.connect(
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new ContactCard(
								dojo.attr(elmt,'link')
							);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		course: function(courses) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				// reference the length of resolved contacts
				var i = courses.length;
				
				html = [];
				while(i--) {
					// build elements for the links
					var courseTitle = courses[i];
					html.push('<button link="'+courseTitle+'">'+courseTitle+'</button>');
				}
				// implode the html string array
				html = html.join('');
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo.query('button', e_dom).forEach( function(elmt) {
					dojo.connect(
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new LectureCard(
								dojo.attr(elmt,'link')
							);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		department: function(str) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button link="'+str+'">'+str+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo.connect(
					e_dom,
					'click',
					function(e) {
						e.stopPropagation();
						new DepartmentCard(str);
					}
				);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		email: function(str) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// assert the required attributes have values
				$.extend({
					class: '',
				}, args);
				
				// create the element
				var e_dom = dojo.create('span', {
					class: args.class,
					innerHTML: args.title+'<a href="mailto:'+str+'">'+str+'</a>',
				});
				
				// bind events to the node
				dojo.connect(e_dom, 'click', DOM_Event.noBubble);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		location: function() {
			
		},
		
		
		widget: function(namespace, data) {
			
		},
		
		
		toString: function() {
			return __func__+'()';
		},
	});
})();