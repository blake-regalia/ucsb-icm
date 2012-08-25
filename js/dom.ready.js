dojo.addOnLoad(function() {
	new EsriMap(DefaultPackage);
	new Omnibox(dojo.byId('omnibox'));
	new CardDeck('stack', dojo.byId('info_deck'));
});