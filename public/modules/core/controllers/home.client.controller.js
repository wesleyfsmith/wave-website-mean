'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$timeout',
	function($scope, Authentication, $http, $timeout) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

//        $scope.allowFullScreen(true);



		$scope.landingView = '/modules/core/views/wavelogo.client.view.html';

		$scope.startFadeOut = false;
		$scope.startFadeIn = false;

		$scope.myonload = function() {
			if (!$scope.startFadeOut) {
				$timeout(function() {
					console.log('1');
					$scope.startFadeOut = true;

					//this will trigger this function to be called again
					$timeout(function() {
						console.log('2');
						$scope.landingView = '/modules/core/views/wavepictures.client.view.html';
					}, 2000);
				}, 2000);
				return;
			}
			if (!$scope.startFadeIn) {
				$timeout(function() {
					console.log('3');
					$scope.startFadeIn = true;
				}, 500);
			}
		};
	}
]);
