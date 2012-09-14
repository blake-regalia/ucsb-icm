

function projectToWM(lat, lng) {
	var source = new Proj4js.Proj('EPSG:4326');
	var dest = new Proj4js.Proj('EPSG:900913');
	var tran = new Proj4js.Point(lng, lat);   //any object will do as long as it has 'x' and 'y' properties
	Proj4js.transform(source, dest, tran);
	
	return tran;
}

dojo['addOnLoad'](function() {
	new EsriMap(DefaultPackage);
	new Omnibox('#omnibox');
	new CardDeck('stack', dojo['byId']('info-deck'));
	new Map();
	initLayers();
	addLayer('recycling');
	
	console.log('Done!');
});