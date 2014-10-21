'use strict';

// Partners controller
angular.module('partners').controller('PartnersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Partners', 'Uploads',
	function($scope, $stateParams, $location, Authentication, Partners, Uploads ) {
		$scope.authentication = Authentication;

		// Create new Partner
		$scope.create = function() {
			// Create new Partner object
			var partner = new Partners ({
				name: this.name
			});

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.upload($scope.photo).success(function(data) {
                partner.photo = data.files[0].url;
                partner.$save(function(response) {
                    $location.path('partners/' + response._id);
                }, errorFunction);
            });

			// Clear form fields
			this.name = '';
		};

		// Remove existing Partner
		$scope.remove = function( partner ) {
			if ( partner ) { partner.$remove();

				for (var i in $scope.partners ) {
					if ($scope.partners [i] === partner ) {
						$scope.partners.splice(i, 1);
					}
				}
			} else {
				$scope.partner.$remove(function() {
					$location.path('partners');
				});
			}
		};

		// Update existing Partner
		$scope.update = function() {
			var partner = $scope.partner;

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            var updatePartner = function() {
                partner.$update(function() {
                    $location.path('partners/' + partner._id);
                }, errorFunction);
            };

            if (typeof $scope.photo !== 'undefined') {
                Uploads.updatePhoto($scope.photo, partner, updatePartner);
            } else {
                updatePartner();
            }

			partner.$update(function() {
				$location.path('partners/' + partner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Partners
		$scope.find = function() {
			$scope.partners = Partners.query();
		};

		// Find existing Partner
		$scope.findOne = function() {
			$scope.partner = Partners.get({ 
				partnerId: $stateParams.partnerId
			});
		};
	}
]);