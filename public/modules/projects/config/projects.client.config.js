'use strict';

// Configuring the Articles module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?', true);
		Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects', null, true);
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create', null, false);
	}
]);