/**
*
* public class ContactCard extends Card
*
**/
(function() {
	
	var __func__ = 'ContactCard';
	
	
	
	var construct = function(contact) {
		
		// super's constructor
		var card = new Card('contact:'+contact.id);
		
		// if this card already exists in the stack
		if(card.index !== -1) {
			CardDeck('stack').draw(card.index);
			return;
		}
		
		
		/**
		* private:
		**/
		var raw = contact();
		var references = {};
		
		// resolve references to courses
		if(raw.instructs.length) {
			references['Instructs'] = new Reference.course(String.splitNoEmpty(raw.instructs));
		}
		
		// resolve office location
		if(raw.location.length) {
			var location = new Location(raw.location);
		}
		
		// setup the format of the card
		card.setup({
			title: contact.fullName,
			subtitle: raw.title,
			icon: 'resource/card.icon.contact.jpg',
			content: {
				'Office': raw.location.length? new Reference.location(location.resolved? location: raw.location): '',
				'Department': new Reference.department(raw.department),
				'Title': raw.title,
				'Email': new Reference.email(raw.email),
			},
			/*
			image: {
				google: {
					demo: (raw.firstName.toLowerCase() == 'blake' && raw.lastName.toLowerCase() == 'regalia')? true: false,
					args: [raw.firstName+' '+raw.lastName],
				},
				url: 'http://www.excursionclubucsb.org/Excursion_Club_at_UCSB/bio/blake.jpg',
			},
			*/
			references: references,
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
			
			// must be over-ridden
			onDraw: function(){},
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