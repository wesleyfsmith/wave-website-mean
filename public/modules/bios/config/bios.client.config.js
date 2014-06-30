'use strict';

// Configuring the Articles module
angular.module('bios').run(['Menus',
	function(Menus) {
//		Set top bar menu items
		Menus.addMenuItem('topbar', 'Bios', 'bios', 'dropdown', '/bios(/create)?', true);
		Menus.addSubMenuItem('topbar', 'bios', 'List Bios', 'bios', true);
		Menus.addSubMenuItem('topbar', 'bios', 'New Bio', 'bios/create', true);
    }
]);