'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Bios',
	function($scope, $upload, $stateParams, $location, Authentication, Bios ) {
		$scope.authentication = Authentication;

        $scope.file = '';

        $scope.onFileSelect = function ($files){
            $scope.file = $files[0];

            //server side can handle anything!!!
            //#serverswag
            $scope.upload = $upload.upload({
                url: '/media',
                method: 'POST',
                data: {},
                withCredentials:true,
                file:$scope.file
            }).success(function(data, status, headers, config) {
                $scope.photo = data;
            }).error(function(err){
                $scope.error = err.data.message;
            });
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
		$scope.create = function($files) {
            var bio = new Bios({
                name:this.name,
                title:this.title,
                number:this.number,
                medium:$scope.photo._id
            });

            bio.$save(function(response) {
                $location.path('bios/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
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
            //todo wesley document this!!!
			$scope.bios = Bios.query().$promise.then(
                function(value) {
                    $scope.bioRows = [];
                    var tempArr;
                    for (var i = 0; i < value.length; i++) {
                        //reset tempArr very third element
                        if (i % 3 === 0) {
                            tempArr = [];
                            $scope.bioRows.push(tempArr);
                        }
                        tempArr.push(value[i]);
                    }
                }
            );

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