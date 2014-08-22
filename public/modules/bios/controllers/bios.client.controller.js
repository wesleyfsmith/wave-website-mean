'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Bios', 'Uploads', 'Teams',
	function($scope, $upload, $stateParams, $location, Authentication, Bios, Uploads, Teams ) {
		$scope.authentication = Authentication;

        $scope.photo = '';

        $scope.onFileSelect = function ($files){
            $scope.photo = $files[0];

            //server side can handle anything!!!
            //#serverswag
//            $scope.upload = $upload.upload({
//                url: '/uploads',
//                method: 'POST',
//                data: {},
//                withCredentials: true,
//                file: $scope.file
//            }).success(function(data, status, headers, config) {
//                $scope.photo = data.files[0].url;
//            }).error(function(err){
//                $scope.error = err.data.message;
//            });



        };

        //initialize the bio teams

        $scope.toggleTeamOnBio = function(team) {
            if ($scope.arrayContains(team)) {
                $scope.teams[team] = false;
            } else {
                $scope.teams[team] = true;
            }
        };

        $scope.arrayContains = function(array, value) {
            if (array.indexOf(value) === -1) {
                return false;
            }
            return true;
        };

        //logic to do when user clicks on bio
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
                title: this.title,
                teams: $scope.teams
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


//                .success(function(data) {
//                for (var team in data) {
//                    $scope.teams[team] = false;
//                }
//            });

            //todo wesley document this!!!
			$scope.bios = Bios.query();

            //create 2d array for easier col/rows
		};

		// Find existing Bio
		$scope.findOne = function() {
			$scope.bio = Bios.get({ 
				bioId: $stateParams.bioId
			}).success(function(bio) {
                //assign teams correctly
                for (var team in $scope.teams) {
                    if ($scope.arrayContains(bio.teams, team)) {
                        $scope.teams[team] = true;
                    }
                }
            });

		};
	}
]);