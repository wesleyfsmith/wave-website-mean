'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bios',
	function($scope, $stateParams, $location, Authentication, Bios ) {
		$scope.authentication = Authentication;

        //logic to do when user clicks on bio
        $scope.selectBio = function(bio){
            //variable to keep track of currently clicked bio
            $scope.clickedBioId = bio._id;

            //store current bio name
            $scope.displayBioName = bio.name;

            //store current bio title
            $scope.displayBioTitle = bio.title;
        };

        $scope.isSelected = function(bioID) {
          return $scope.clickedBioId === bioID;
        };

		// Create new Bio
		$scope.create = function() {
			// Create new Bio object
			var bio = new Bios ({
				name: this.name
			});

			// Redirect after save
			bio.$save(function(response) {
				$location.path('bios/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Bio
		$scope.remove = function( bio ) {
			if ( bio ) { bio.$remove();

				for (var i in $scope.bios ) {
					if ($scope.bios [i] === bio ) {
						$scope.bios.splice(i, 1);
					}
				}
			} else {
				$scope.bio.$remove(function() {
					$location.path('bios');
				});
			}
		};

		// Update existing Bio
		$scope.update = function() {
			var bio = $scope.bio ;

			bio.$update(function() {
				$location.path('bios/' + bio._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Bios
		$scope.find = function() {
			$scope.bios = Bios.query();
		};

		// Find existing Bio
		$scope.findOne = function() {
			$scope.bio = Bios.get({ 
				bioId: $stateParams.bioId
			});
		};
	}
]);