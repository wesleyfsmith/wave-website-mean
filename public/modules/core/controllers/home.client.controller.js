'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.allowFullScreen(true);

		$scope.tweets = [];

		$http.get('/tweets').success(function(data, status, headers, config) {
			$scope.tweets = data.statuses;
		});
	}
]);
