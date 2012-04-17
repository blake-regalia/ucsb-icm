
/** faculty **/
var names = [];

$('.person').each(function() {
	var name = $(this).find('strong').text();
	var lni = name.lastIndexOf(' ');
	var first = name.substr(0, lni);
	var last = name.substr(lni+1);
	names.push(last+', '+first);
});


names.sort();
var i = names.length;

var sorted=[];
while(i--) {
	sorted.push(names[i]);
}

JSON.stringify(sorted);



/** staff **/
var names = [];

$('.staff').each(function() {
	var name = $(this).find('.name').text();
	var lni = name.lastIndexOf(' ');
	var first = name.substr(0, lni);
	var last = name.substr(lni+1);
	names.push(last+', '+first);
});


names.sort();
var i = names.length;

var sorted=[];
while(i--) {
	sorted.push(names[i]);
}

JSON.stringify(sorted);