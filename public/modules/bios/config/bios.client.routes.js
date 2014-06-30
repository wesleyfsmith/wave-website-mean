'use strict';

//Setting up route
angular.module('bios').config(['$stateProvider',
	function($stateProvider) {
		// Bios state routing
		$stateProvider.
		state('listBios', {
			url: '/bios',
			templateUrl: 'modules/bios/views/list-bios.client.view.html'
		}).
		state('createBio', {
			url: '/bios/create',
			templateUrl: 'modules/bios/views/create-bio.client.view.html'
		}).
		state('viewBio', {
			url: '/bios/:bioId',
			templateUrl: 'modules/bios/views/view-bio.client.view.html'
		}).
		state('editBio', {
			url: '/bios/:bioId/edit',
			templateUrl: 'modules/bios/views/edit-bio.client.view.html'
		});
	}
]);