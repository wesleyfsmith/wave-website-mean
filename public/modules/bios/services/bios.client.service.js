'use strict';

//Bios service used to communicate Bios REST endpoints
angular.module('bios').factory('Bios', ['$resource',
	function($resource) {
		return $resource('bios/:bioId', { bioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);