
/** Download **/
(function() {
	var queue = {
		pending: 0,
		index: 0,
	};
	var self = {
		listeners: [],
		ready: function() {
			while(self.listeners.length) {
				self.listeners.shift()();
			}
		},
	};
	var global = window.Download = function(ajax_options) {
		var index = queue.index++;
		ajax_options.source_success = ajax_options.success;
		
		ajax_options.success = (function() {
			var own = this;
			return function() {
				console.log(own);
				own.success.apply(window,arguments);
				Download.complete(index);
			};
		}).apply({success:ajax_options.source_success,w:ajax_options.url});
		
		console.log(ajax_options);
		
		queue.pending += 1;
		$.ajax(ajax_options);
	};
	$.extend(global, {
		ready: function(callback) {
			self.listeners.push(callback);
		},
		complete: function(index) {
			queue.pending -= 1;
			if(!queue.pending) {
				self.ready();
			}
		},
	});
})();