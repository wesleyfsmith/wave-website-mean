'use strict';

angular.module('core').directive('footer', ['$http',
	function($http) {
		return {
			templateUrl: '/modules/core/views/footer.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.tweets = [];

				$http.get('/tweets').success(function(data, status, headers, config) {
					console.log('derp');
					scope.tweets = data.statuses;
				});
			}
		};
	}
]);
