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
		
		administration: function(people) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html = '';
				
				var i = people.length;
				while(i--) {
					var person = people[i];
					html += '<div><button link="'+person.firstName+' '+person.lastName+'">'+person.title+'</button></div>';
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
								dojo.attr(elmt, 'link')
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
		
		building: function(buildingId) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// prepare to generate an html string
				var html;
				
				html = '<button>'+(new Building(buildingId)).getName()+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the nodes
				dojo.query('button', e_dom).forEach( function(elmt) {
					dojo.connect(
						elmt,
						'click',
						function(e) {
							e.stopPropagation();
							new BuildingCard(buildingId);
						}
					);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
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
				
				// build the html string
				var html = '<a href="mailto:'+str+'">'+str+'</a>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo.connect(e_dom, 'click', DOM_Event.noBubble);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		location: function(str) {
			
			var location = new Location(str);
			
			if(!location.resolved) {
				global.warn('could not create reference to unknown location');
			}
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button>'+location.toString()+'</button>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo.connect(dojo.query('button', e_dom)[0], 'click', function(e) {
					e.stopPropagation();
					location.execute();
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
			
		},
		
		
		website: function(url) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<a href="'+url+'">'+url+'</a>';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo.connect(e_dom, 'click', DOM_Event.noBubble);
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		widget: function(namespace, data) {
			
			var instance = construct.apply(this, arguments);
			
			instance.build = function(args) {
				
				// build the html string
				var html = '<button>'+args.title+'</button>';
				
				args.title = '';
				
				// construct a standard reference dom node
				var e_dom = refer(args, html);
				
				// bind events to the node
				dojo.connect(e_dom, 'click', function(e) {
					e.stopPropagation();
					console.info(namespace, data);
				});
				
				// return the constructed element
				return e_dom;
			};
			
			// return an object instance
			return instance;
		},
		
		
		toString: function() {
			return __func__+'()';
		},
	});
})();