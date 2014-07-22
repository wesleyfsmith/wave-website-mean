'use strict';

// Configuring the Articles module
angular.module('bios').run(['Menus',
	function(Menus) {
//		Set top bar menu items
        /**
         * Don't do anythong in here for now we'll fix this later
         * TODO fix this crap
         */
		Menus.addMenuItem('topbar', 'Bios', 'bios', 'dropdown', '/bios(/create)?', true);
        //friggin' order of parameters is screwed up
		Menus.addSubMenuItem('topbar', 'bios', 'List Bios', 'bios', null, true);
		Menus.addSubMenuItem('topbar', 'bios', 'New Bio', 'bios/create', null, false);
    }
]);