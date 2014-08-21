'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Bios', 'Uploads',
	function($scope, $upload, $stateParams, $location, Authentication, Bios, Uploads ) {
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

        $scope.bioTeams = [];

        $scope.teams = ['Executive', 'Board of Directors', 'Power Electronics Engineering', 'Software Engineering', 'Mechanical', 'Manufacturing Engineering'];

        $scope.toggleTeamOnBio = function(team) {
            if ($scope.bioTeams.indexOf(team) === -1) {
                $scope.bioTeams.push(team);
            } else {
                var index = $scope.bioTeams.indexOf(team);
                $scope.bioTeams.splice(index, 1);
            }
            console.log($scope.bioTeams);
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
                teams: $scope.bioTeams
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
            $scope.bioTeams = [];
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


        $scope.bios = [];
        $scope.gridData = { data: 'bios'};

		// Find a list of Bios
		$scope.find = function() {
            //todo wesley document this!!!
			$scope.bios = Bios.query();

            //create 2d array for easier col/rows
		};

		// Find existing Bio
		$scope.findOne = function() {
			$scope.bio = Bios.get({ 
				bioId: $stateParams.bioId
			});
		};
	}
]);