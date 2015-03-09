'use strict';

angular.module('core').directive('footer', [
	function() {
		return {
			templateUrl: '/modules/core/views/footer.client.view.html',
			restrict: 'E',
			link: function postLink($scope, element, attrs) {
				// Footer directive logic
				// ...

				element.text('this is the footer directive');

				$scope.tweets = [];

				$http.get('/tweets').success(function(data, status, headers, config) {
					$scope.tweets = data.statuses;
				});
			}
		};
	}
]);
