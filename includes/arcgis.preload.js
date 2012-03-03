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
					marks: [],
				};
			}
		},
		stop: function(key, action) {
			if(arguments.length < 2) action = 'complete';
			var bench = event[key];
			if(bench) {
				bench.stop = {
					time: now(),
					action: action,
				};
				console.info(selfToString,': ',key,' took ',format(bench.stop.time-bench.start),' to ',action);
			}
		},
		mark: function(what, since) {
			var bench = event[since];
			if(bench) {
				var mark = now()-bench.start;
				bench.marks.push({
					after: mark,
					what: what,
					
				});
				console.info(selfToString,': ',what,' took ',format(mark),' since ',since,' started');
			}
		},
		save: function(as) {
			var log = '';
			for(var e in event) {
				var bench = event[e];
				var marks = bench.marks;
				var length = marks.length;
				for(var i=0; i!==length; i++) {
					var mark = marks[i];
					log += mark.what+' took '+format(mark.after)+' since '+e+' started\n';
				}
				if(bench.stop) {
					log += e+' took '+format(bench.stop.time-bench.start)+' to '+bench.stop.action+'\n';
				}
			}
			
			var framework = false;
			if(typeof dojo !== 'undefined' && dojo) framework = dojo;
			/*
			if(framework && framework.get) {
				framework.get({
					url: 'benchmark.php?save='+as+'&log='+log,
				});
			}*/
			console.log(log);
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