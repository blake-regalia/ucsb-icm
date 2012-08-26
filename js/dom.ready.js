dojo.addOnLoad(function() {
	new EsriMap(DefaultPackage);
	new Omnibox('#omnibox');
	new CardDeck('stack', dojo.byId('info-deck'));
});