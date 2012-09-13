/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

    

(function() {
	var __func__ = 'GoogleImageSearch';
	
	var searcher;
	var callback;
	
	var self = {
		searchComplete: function(searcher) {
			if (searcher.results && searcher.results.length > 0) {
				var result = searcher.results[0];
				callback.apply(callback, [result.url]);
			}
		},
	};
	
	
	var global = window[__func__] = function(fullName, callbackMethod) {
		callback = callbackMethod;
		searcher.execute(fullName);
	};
	
	
	
	$.extend(global, {
		
		onLoad: function() {
			searcher = new google.search.ImageSearch();
			searcher.setSiteRestriction('ucsb.edu');
			searcher.setRestriction(
				google.search.ImageSearch.RESTRICT_IMAGETYPE,
				google.search.ImageSearch.IMAGETYPE_FACES
			);
			searcher.setSearchCompleteCallback(self, self.searchComplete, [searcher]);
		},
		
		toString: function() {
			return __func__+'()';
		}
	});
	
	
	google.load('search', '1');
	google.setOnLoadCallback(global.onLoad);
	
})();