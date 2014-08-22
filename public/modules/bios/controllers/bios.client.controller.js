'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Bios', 'Uploads', 'Teams',
	function($scope, $upload, $stateParams, $location, Authentication, Bios, Uploads, Teams ) {
		$scope.authentication = Authentication;

        $scope.onFileSelect = function ($files){
            $scope.photo = $files[0];
        };

        $scope.arrayContains = function(array, value) {
            if (array.indexOf(value) === -1) {
                return false;
            }
            return true;
        };

        //logic to do when user clicks on bio MOVE TO DIRECTIVE
        $scope.selectBio = function(bio){
            //variable to keep track of currently clicked bio
            $scope.mouseOverBioId = bio._id;

            //store current bio name
            $scope.displayBioName = bio.name;

            //store current bio title
            $scope.displayBioTitle = bio.title;
        };

        $scope.isSelected = function(bioID) {
          return $scope.mouseOverBioId === bioID;
        };

		// Create new Bio
		$scope.create = function() {
            var bio = new Bios({
                name: this.name,
                title: this.title
            });

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.upload($scope.photo).success(function(data) {
                bio.photo = data.files[0].url;
                bio.$save(function(response) {
                    $location.path('bios/' + response._id);
                }, errorFunction);
            }).error(errorFunction);

			// Clear form fields
			this.name = '';
            this.title = '';
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

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.delete(bio.photo).success(function(data) {
                bio.$update(function() {
                    $location.path('bios/' + bio._id);
                }, errorFunction);
            }).error(errorFunction);
		};

        $scope.teams = Teams.query();

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