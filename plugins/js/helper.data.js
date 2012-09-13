(function() {
	
	var __func__ = 'DataHelper';
	
	var BUFFER_SIZE = 128;
	
	
	var callbackLoop = function() {
		
		var loop = this.data;
		
		// static data
		var dataset = loop.dataset;
		var dataLength = dataset.length;
		var udn = loop.udn;
		var controller = loop.controller;
		var callback = loop.callback;
		
		// variables will be modified
		var row = loop.row;
		var slots = loop.bufferSlots;
		
		while(this.runs() && (row < dataLength)) {
			if(slots == 0) {
				console.warn('buffer full. pausing thread');
				loop.cycles += 1;
				loop.row = row;
				loop.bufferSlots = slots;
				return this.die();
			}
			else {
				slots -= 1;
				var returns = callback.apply(udn, [row, dataset[row], controller]);
				if(returns === false) break;
			}
			row += 1;
		}
		
		loop.cycles += 1;
		loop.row = row;
		loop.bufferSlots = slots;
		
		this.cycle();
	};
	
	
	var construct = function(namespace, urls) {
		
		/**
		* private:
		**/
		var offline = {};
		var waiting = {};
		var looping = {};
		var pointer = {};
		var handler = {};
		
		var queuedRequests = {};
		var queuedResponses = {};
		var timeouts = {};
		
		var progress = new ProgressIndicator(namespace);
		
		var eventHandler = new EventHandler();
		var uid = 0;
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		// fires when callback functions are ready to be executed
		var callback = function(udn, pid) {
		
			var set = waiting[udn];
			var eachCallback = set[0];
			var dataset = offline[udn];
				
			var doneSize = dataset.length;
			
			var controller = {
				doneWith: function(i) {
					progress(udn, i / (doneSize - 1));
					callbackThread.execute('freeBuffer');
					if(i == doneSize-1) {
						eventHandler('done:'+pid)();
						progress.complete();
					}
				},
			};
			
			// NOW declare the threaded each-callback loop so it can reference the handler function
			var callbackThread = new ThreadedLoop(callbackLoop, {
				cycleTime: 1200,
				breatheTime: 20,
				data: {
					cycles: 0,
					row: 0,
					bufferSlots: BUFFER_SIZE,
					dataset: offline[udn],
					controller: controller,
					udn: udn,
					callback: eachCallback,
				},
				beforeStart: function() {
				},
			});
			
			callbackThread.define('freeBuffer', function() {
				this.data.bufferSlots += 1;
				if(!this.isRunning()) {
					console.info('resuming thread');
					callbackThread.resume();
				}
			});
			
			if(waiting[udn]) {
				callbackThread();
			}
			
			else if(waiting[udn]) {
				var set = waiting[udn];
				var i = set.length;
				// TODO: implement threaded loop control
				while(i--) {
					looping = set.pop();
					var dataset = offline[udn];
					var len= dataset.length, row = -1;
					
					console.log('woah, calling back ',i);
					while(++row !== len) {
						var returns = looping.apply(udn, [row, dataset[row], controller]);
						if(returns === false) break;
					}
					
					doneSize = row;
					pointer[udn] = row;
				}
				if(waiting[udn].length == 0) delete waiting[udn];
			}
			
			// if the looper is done with all the tasks
			if(!waiting[udn] || !waiting[udn].length) {
				
//				console.log('looper is done');
					
				// trigger the event ready handler
//				eventHandler('done:'+pid)();
			}
		};
		
		var chain = function(udn) {
			
			var url = urls[udn];
			
			var op = function() {
				
			};
			
			var requestQueue = queuedRequests[udn];
			if(!requestQueue) requestQueue = queuedRequests[udn] = [];
			var responseQueue = queuedResponses[udn];
			if(!responseQueue) responseQueue = queuedResponses[udn] = [];
			
			$.extend(op, {
				
				// execute a function on the entire dataset
				each: function(fn) {
					
					// assign this call a unique process identifier
					var pid = uid++;
					
					// wait until the last minute to download data
					if(!offline[udn]) {
						// if there isn't an array for the given udn, create it
						if(!waiting[udn]) waiting[udn] = [];
						
						// append this function to the waiting list
						waiting[udn].push(fn);
						
						// download the data
						Download.json('data/'+url+'.json', function(json) {
							// cache the results
							offline[udn] = json;
							
							// execute the callback sequence for this process identifier
							callback(udn, pid);
						});
					}
					// data was already downloaded
					else {
						// execute callback sequence immediately
						callback(udn, pid);
					}
					
					// return an ojbect capable of binding this instance's event handler to a unique callback id
					return {
						bind: function(eventName, fn) {
							eventHandler(eventName+':'+pid, fn);
						},
					};
				},
				
				// execute an sql query on the given dataset
				where: function(q) {
					var query = [];
					for(var e in q) {
						query.push('`'+e+'`=\''+q[e]+'\'');
					}
					
					var privateEventHandler = new EventHandler();
					var privateDownload = false;
					
					/**/
					responseQueue.push(privateEventHandler('ready'));
					if(requestQueue.push(url+'@('+query.join(',')+').json') == BUFFER_SIZE) {
						Download.jsonPost('data/batch.json', {
							requests: requestQueue,
						}, function(json) {
							console.log(json);
							privateDownload = true;
							var len = json.responses.length, i = -1;
							var resp = json.responses;
							while(++i !== len) {
								responseQueue[i](
									resp[i].data
								);
							}
							responseQueue.splice(0, len);
							requestQueue.splice(0, len);
						});
					}
					
					clearTimeout(timeouts[udn]);
					timeouts[udn] = setTimeout(function() {
						Download.jsonPost('data/batch.json', {
							requests: requestQueue,
						}, function(json) {
							console.log(json);
							privateDownload = true;
							var len = json.responses.length, i = -1;
							var resp = json.responses;
							while(++i !== len) {
								responseQueue[i](
									resp[i].data
								);
							}
							responseQueue.splice(0, len);
							requestQueue.splice(0, len);
						});
					}, 250);
					
					/**/
					//console.log(requestQueue.length);
					
					/**
					Download.json('data/'+url+'@('+query.join(',')+').json', function(json) {
						var f = privateEventHandler('ready');
						json.get = function(i) {
							if(!json[i]) return global.warn('index out of range: ',i);
							return json[i];
						};
						f(json);
						privateDownload = json;
					});
					/**/
					
					return {
						bind: function(eventName, fn) {
							if(privateDownload) {
								fn(privateDownload);
							}
							else {
								privateEventHandler(eventName, fn);
							}
						}
					};
				},
			});
			
			return op;
		};
		
		/**
		* public operator() ();
		**/
		var operator = function(udn) {
			if(!urls[udn]) {
				global.error(namespace,'; database wasn\'t connected to: "'+udn+'"');
				return;
			}
			return chain(udn);
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// binds an event listener to this object instance
			bind: eventHandler,
		});
		
		
		return operator;
		
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