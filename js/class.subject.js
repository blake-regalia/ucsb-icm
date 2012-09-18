/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

/**
*
* public class Subject
*
**/
(function() {
	
	var __func__ = 'Subject';
	
	var database = {
		abrvToName: {},
		nameToAbrv: {},
	};
	
	var construct = function(subject) {
		
		/**
		* private:
		**/
		var subjectAbrv = subject.subjectAbrv;
		var subjectName = subject.subjectName;
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return subject;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: subjectAbrv,
			
			getName: function() {
				return subjectName;
			},
			
			
			// over-ride toString method
			toString: function() {
				return __func__+' '+subjectName;
			},
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(a, b) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return new Subject({
				subjectAbrv: a? a: global.nameToAbrv(b),
				subjectName: b? b: global.abrvToName(a),
			});
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
		
		
		//
		newCard: function(format) {
			return function(str) {
				Download.json("data/ucsb/registrar.subjects@(["+format+"]='"+str+"').json",
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var subject = new global(json[0]);
						new SubjectCard(subject);
					}
				);
			};
		},
		
		
		// attempt to translate a subject name to a subject abrv
		nameToAbrv: function(subjectName) {
			
			// perform a hash-table lookup on the input string
			var subjectAbrv = database.nameToAbrv[subjectName];
			
			// check if an entry exists for the given subject name
			if(typeof subjectAbrv === 'undefined') {
				global.error('subject name not found: "',subjectName,'"');
				return false;
			}
			
			// return the abrv if it was found
			return subjectAbrv;
		},
		
		// attempt to translate an subject name to a subject abrv
		abrvToName: function(subjectAbrv) {
			
			// perform a hash-table lookup on the input string
			var subjectName = database.abrvToName[subjectAbrv];
			
			// check if an entry exists for the given subject name
			if(typeof subjectName === 'undefined') {
				global.error('subject abrv not found: ',subjectAbrv,'');
				return false;
			}
			
			// return the name
			return subjectName;
		},
		
	});
	
	
	/**
	* 1-time invocation 
	**/
	Download.json({
		urls: {
			nameToAbrv: 'data/ucsb/registrar.subjects#{`subjectName`:`subjectAbrv`}.json',
			abrvToName: 'data/ucsb/registrar.subjects#{`subjectAbrv`:`subjectName`}.json',
		},
		each: function(id, json) {
			database[id] = json;
		},
		ready: function() {
			downloadsReady = true;
		},
	});
})();