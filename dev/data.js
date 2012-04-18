window.data = [];


// Fills a string with numbers so hexadecimal and binary strings are formatted properly
String.fill = function(f, str) {
	return [f.substr(str.length),str].join('');
};

$(document).ready(function() {
	$('.update').click(function() {
		eval('window.data=['+$('.debug').val()+'];');
		parseData();
	});
	$('.run').click(function() {
		window.eval($('.script').val());
	});
});

var parseData = function() {
	var tc = [];
	var p = parseInt;
	var q = "'", bo = '['; bc = ']';
	var day, time, time0, time1, where, size;
	for(var d=0; d<data.length; d++) {
		var page = data[d];
		for(var c=0; c<page.length; c++) {
			var class = page[c];
			for(var s=0; s<class.length; s++) {
				var one = class[s];
				day = one[0]; time = one[1]; where = one[2]; size = one[3];
				day = day.replace(/ +$/,'');
				day = day.replace(/ +/g,'');
				if(!/^[MTWRF ]+$/.test(day)) continue;
				time = time.replace(/ +$/,'');
				var m = /^(\d+):(\d\d) ([AP]M)\-(\d+):(\d\d) ([AP]M)$/.exec(time);
				if(m === null) continue;
				time0 = 60*p(m[1]) + p(m[2]);
				
				if(m[1] != '12' && m[3] == 'PM') time0 += 12*60;
				time1 = 60*p(m[4]) + p(m[5]);
				if(m[4] != '12' && m[6] == 'PM') time1 += 12*60;
				where = where.replace(/^([^\s]+).*$/,'$1');
				where = where.replace(/^([^\d]+)\d+$/,'$1');
				size = size.replace(/ +$/,'');
				size = p(size);
				if(isNaN(size)) continue;
				var wave = [];
				wave.push([q,day,q].join(''));
				//wave.push([q,time,q].join(''));
				wave.push(time0); wave.push(time1);
				wave.push([q,where,q].join(''));
				wave.push(size);
				tc.push([bo,wave.join(','),bc].join(''));
			}
			//ts.push(["['",tc.join(',\n'),"']"].join(''));
		}
	}
	$('.debug').val(tc.join(',\n'));
};
