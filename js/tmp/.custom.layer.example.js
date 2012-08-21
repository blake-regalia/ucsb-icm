(function(Layer) {
	
	Menu.setup({
		title: 'bus routes',
		icon: {
			idle: 'busroutes.gif',
			hover: 'busroutes-hover.gif',
			active: 'busroutes-active.gif',
		},
		click: Layer.enable,
	});
	
	Layer.setup({
		enable: function() {
			
		},
	});
	
})();