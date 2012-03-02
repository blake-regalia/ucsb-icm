var djConfig = {
	parseOnLoad: true
};

(function() {
	var date = Date;
	var now = function() {
		return (new date()).getTime();
	};
	
	var event = {};
	var selfToString = 'Benchmark()';
	
	var fancy = false;
	
	var time_form = 'ms';
	var format = function(time) {
		if(isNaN(time)) return time;
		var str = false;
		switch(time_form) {
			case 'ms':
				str = time+'ms';
				break
			case 's':
				str = (time/1000)+'s';
		}
		if(str === false) return str;
		if(fancy) {
			var p = function(){};
			p.toString = function(){return str;};
			return p;
		}
		return str;
	};
	
	var global = window.Benchmark = {
		start: function(key) {
			if(!event[key]) {
				event[key] = {
					start: now(),
				};
			}
		},
		stop: function(key, action) {
			if(arguments.length < 2) action = 'complete';
			var mark = event[key];
			if(mark) {
				mark.stop = now();
				console.info(selfToString,': ',key,' took ',format(mark.stop-mark.start),' to ',action);
			}
		},
		mark: function(what, since) {
			var mark = event[since];
			console.info(selfToString,': ',what,' took ',format(now()-mark.start),' since ',since,' started');
		},
		toString: function() {
			return 'Benchmark()';
		},
		setFormat: function(time_format) {
			switch(time_format.toLowerCase()) {
				case 's': time_form = 's'; break;
				case 'ms': time_form = 'ms'; break;
			}
		},
		setFancy: function(bool) {
			fancy = !!bool;
		},
	};
	Benchmark.setFancy(true);
	Benchmark.setFormat('s');
	Benchmark.start('script');
})();