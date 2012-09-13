
 /** ************************* **/
 /**** XML to JSON Converter ****/
 /** ************************* **/
 /** *    Copyright (C) 2012     * **/
 /** *      Blake Regalia        * **/
 /** * <blake.regalia@gmail.com> * **/
 /** ***************************** **/

 
 // converts all tag-names to lower-case
function xml2jsoni(xml) { 
}

function xml2json(xml) {
	var object = {
		'$': 'document',
		'$children': {'$length': 0},
	};
	var self = object;
	var link = [];
	var state = 0;
	var build = {};
	var name = [];
	var value = [];
	var raw = false;
	
	var read = {
		
		
		// expecting new node or text
		0: function(chr) {
			if(chr === '<') {
				if(value.length) {
					var text = value.join('').replace(/^\s*/,'').replace(/\s*$/,'');
					if(text.length) {
						self['$text'] = text;
					}
					value.length = 0;
				}
				name.length = 0;
				state = 1;
			}
			else {
				value.push(chr);
			}
		},
		
		
		// expecting node name
		1: function(chr) {
			var code = chr.charCodeAt(0);
			/**          [a-z]                        [0-9:]                      [A-Z]     **/
			if((code > 96 && code < 123) || (code > 47 && code < 59) || (code > 64 && code < 91)) {
				name.push(chr);
			}
			else if(name.length) {
				var build = {};
				link.push(self);
				var child = self['$children'];
				child[child['$length']++] = build;
				self = build;
				self['$'] = name.join('');
				name.length = 0;
				var semi = self['$'].indexOf(':');
				if(self['$'].substr(semi) === ':html') {
					raw = true;
					if(chr === '>') {
						return state = 10;
					}
				}
				if(chr === '/') {
					state = 6;
				}
				else if(chr === '>') {
					self['$children'] = {'$length': 0};
					state = 0;
				}
				else if(chr === ' ' || chr === '\t' || chr === '\n') {
					state = 2;
				}
			}
			
			// ending tag
			else if(chr === '/') {
				state = 7;
			}
			
			// begin comment
			else if(chr === '!') {
				value.length = 0;
				name.length = 0;
				state = 11;
			}
			
			// error: malformed xml
			else {
				
			}
		},
		
		
		// expecting attribute name followed by `=`
		2: function(chr) {
			var code = chr.charCodeAt(0);
			/**          [a-z]                        [0-9:]                      [A-Z]     **/
			if((code > 96 && code < 123) || (code > 47 && code < 59) || (code > 64 && code < 91)) {
				name.push(chr);
			}
			else if(name.length) {
				if(chr === '=') {
					state = 3;
				}
				else {
					self[name.join('')] = true;
					if(chr === '/') {
						state = 6;
					}
					else if(chr === '>') {
						if(raw) {
							return state = 10;
						}
						self['$children'] = {'$length': 0};
						state = 0;
					}
					else if(chr === ' ' || chr === '\t' || chr === '\n') {
						name.length = 0;
					}
					else {
						// error: expected `=` after `',name.join(''),'`
					}
				}
			}
			else {
				if(chr === '/') {
					state = 6
				}
				else if(chr === '>') {
					if(raw) {
						return state = 10;
					}
					self['$children'] = {'$length': 0};
					state = 0;
				}
				else if(chr === ' ' || chr === '\t' || chr === '\n') {
					
				}
				else {
					// error: expected closing delimeter `>` after `',name.join(''),'`
				}
			}
		},
		
		
		// expecting attribute value starting quotation
		3: function(chr) {
			if(chr === '"') {
				state = 4;
			}
			else {
				// error: expect `"` after `=`
			}
		},
		
		
		// expecting attribute value followed by `"`
		4: function(chr) {
			if(chr !== '"') {
				value.push(chr);
			}
			else {
				self[name.join('')] = value.join('');
				name.length = value.length = 0;
				state = 5;
			}
		},
		
		
		// expecting attribute separator ` `, OR single node ending tag `/`, OR ending tag `>`
		5: function(chr) {
			if(chr === ' ' || chr === '\t' || chr === '\n') {
				state = 2;
			}
			else if(chr === '/') {
				state = 6;
			}
			else if(chr === '>') {
				if(raw) {
					return state = 10;
				}
				self['$children'] = {'$length': 0};
				state = 0;
			}
			else {
				// error: unexpected `',chr,'` inside attribute node
			}
		},
		
		
		// expecting closing tag `>` after `/`
		6: function(chr) {
			if(chr === '>') {
				self = link.pop();
				state = 0;
			}
			else {
				// error: expected `>` after `/`
			}
		},
		
		
		// expecting matching close node
		7: function(chr) {
			var code = chr.charCodeAt(0);
			/**          [a-z]                        [0-9:]                      [A-Z]     **/
			if((code > 96 && code < 123) || (code > 47 && code < 59) || (code > 64 && code < 91)) {
				name.push(chr);
			}
			else if(name.length) {
				if(chr === '>') {
					var ending = name.join('');
					if(ending === self['$']) {
						self = link.pop();
						state = 0;
					}
					else {
						// error
					}
				}
			}
			else if(chr !== ' ' || chr !== '\t' || chr !== '\n') {
				
			}
			else {
				// error: none
			}
		},
		
		
		// waiting for end html
		10: function(chr) {
			name.push(chr);
			value.push(chr);
			if(chr === '<') {
				name.length = 0;
				name = [chr];
			}
			else if(chr === '>') {
				var end_tag = name.join('');
				var colon = end_tag.indexOf(':');
				if(colon !== -1 && end_tag.substr(colon) === ':html>') {
					self['#html'] = value.join('').substr(0,-end_tag.length);
					self = link.pop();
					value.length = 0;
					raw = false;
					state = 0;
				}
			}
		},
		
		
		// waiting for end comment
		11: function(chr) {
			name.push(chr);
			if(chr === '>') {
				var chunk = name.join('');
				var hyphen = chunk.lastIndexOf('--');
				if(hyphen !== -1 && chunk.substr(hyphen) === '-->') {
					name.length = 0;
					state = 0;
				}
			}
		},
	};
	
	// iterate through the string and parse one by one
	for(var i=0; i<xml.length; i++) {
		read[state](xml[i]);
	}
	if(value.length) {
		object['$text'] = value.join('');
	}
	return object;
};



if(exports) exports.xml2json = xml2json;