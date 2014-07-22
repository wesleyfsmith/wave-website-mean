'use strict';

// Configuring the Articles module
angular.module('stories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stories', 'stories', 'dropdown', '/stories(/create)?', true);
		Menus.addSubMenuItem('topbar', 'stories', 'List Stories', 'stories', null, true);
		Menus.addSubMenuItem('topbar', 'stories', 'New Story', 'stories/create', null, false);
	}
]);