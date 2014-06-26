'use strict';

// Configuring the Articles module
angular.module('stories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('News', 'Stories', 'stories', 'dropdown', '/stories(/create)?');
		Menus.addSubMenuItem('News', 'stories', 'List Stories', 'stories');
		Menus.addSubMenuItem('News', 'stories', 'New Story', 'stories/create');
	}
]);