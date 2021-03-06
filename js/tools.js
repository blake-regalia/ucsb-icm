/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

//This function is used to display/hide the sideInfoWindow
//To use, make sure the object has an id set (ex: <div id="foo">)
function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
	  e.style.display = 'none';
   else
	  e.style.display = 'block';
}


EsriMap.ready( function(map_element) {
	var header_space = CSS.header_space.value;
	map_element.style.height = (dojo.position(map_element).h - header_space)+'px';
});




function projectToWM(lat, lng) {
	var source = new Proj4js.Proj('EPSG:4326');
	var dest = new Proj4js.Proj('EPSG:900913');
	var tran = new Proj4js.Point(lng, lat);   //any object will do as long as it has 'x' and 'y' properties
	Proj4js.transform(source, dest, tran);
	
	return tran;
}


// put any scripts you are testing in here
EsriMap.ready(function() {
	
	var map = this;
	
	// Initialize vector layers to "Layers" pane
	window.initLayer = function(url, id) {
		var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, visible:false});
		map.addLayer(layer);
		return layer;
	}
	
	window.initLayers = function(){
		//recycling = initLayer("http://ags2.geog.ucsb.edu//arcgis/rest/services/icmRecyclingPoints/MapServer", "recycling");
		//BikeRepairStations = initLayer("http://ags2.geog.ucsb.edu//ArcGIS/rest/services/icmBicycleRepairStations2/MapServer", "BikeRepairStations");
	}
	
	//Functions to add/remove/swap layers.
	window.hideDynamicLayers = function(layers) {
		for (var j=2, jl=map.layerIds.length; j<jl; j++) {
			var layers = map.getLayer(map.layerIds[j]);
			if (dojo.indexOf(layers) == -1) {
				layers.hide();
			}
		}
	}
	window.changeMap = function(layers) {
		hideDynamicLayers(layers);
		for (var i=0; i<layers.length; i++) {
			layers[i].show();
			map.setExtent(layers[i].fullExtent); //use staff.fullExtent to set all layer views to parking's largest extent. For extent of each layer, use layers[i].fullExtent 
		}
	}
	
});










Contacts = {
	lookup: function(fullName) {
		new ContactCard(fullName);
	},
};


// Lectures
(function() {
	var __func__ = 'Lectures';
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		lookup: function(level) {
			return function(id) {
				new LectureCard(id.substr(0, id.indexOf(' - ')));
			};
		},
	});
})();


(function() {
	var __func__ = 'SearchQuery';
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function(query) {
		dojo.xhrGet({
			url: 'data/service.php?q='+query,
			handleAs: 'json',
			load: function(json) {
				console.log(json);
			},
		});
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		}
	});
})();