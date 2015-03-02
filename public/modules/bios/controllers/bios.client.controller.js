'use strict';

// Bios controller
angular.module('bios').controller('BiosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Bios', 'Uploads',
	function($scope, $upload, $stateParams, $location, Authentication, Bios, Uploads) {
		$scope.authentication = Authentication;

        $scope.onFileSelect = function ($files){
            $scope.photo = $files[0];
        };

        $scope.initSelectedTeams = function() {
            var selectedTeams = {};
            selectedTeams['Executive'] = false;
            selectedTeams['Board of Directors'] = false;
            selectedTeams['Power Electronics Engineering'] = false;
            selectedTeams['Software Engineering'] = false;
            selectedTeams['Mechanical Engineering'] = false;
            selectedTeams['Manufacturing Engineering'] = false;

            $scope.selectedTeams = selectedTeams;
        };

        var arrayContains = function(array, value) {
            if (array.indexOf(value) === -1) {
                return false;
            }
            return true;
        };

        var readTeamsFromBioToSelected = function(bio) {
            for (var team in $scope.selectedTeams) {
                if (arrayContains(bio.teams, team)) {
                    $scope.selectedTeams[team] = true;
                }
            }
        };

        var addSelectedTeamsToBio = function(bio) {
            for (var team in $scope.selectedTeams) {
                //they've added a team that the bio didn't belong to already
                if ($scope.selectedTeams[team] === true) {
                    if (!arrayContains(bio.teams, team)) {
                        bio.teams.push(team);
                    }
                } else if (arrayContains(bio.teams, team)) {
                    //they have the team and it should be removed
                    var index = bio.teams.indexOf(team);
                    bio.teams.splice(index, 1);
                }
            }
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
                title: this.title,
                teams: []
            });

            addSelectedTeamsToBio(bio);

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

            addSelectedTeamsToBio(bio);

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            var updateBio = function() {
                bio.$update(function() {
                    $location.path('bios/' + bio._id);
                }, errorFunction);
            };

            if (typeof $scope.photo !== 'undefined') {
                Uploads.updatePhoto($scope.photo, bio, updateBio);
            } else {
                updateBio();
            }

		};

        // Find a list of Bios
		$scope.find = function() {

            //sort them

            var bioBuckets = {};

            bioBuckets['Executive'] = [];
            bioBuckets['Board of Directors'] = [];
            bioBuckets['Power Electronics Engineering'] = [];
            bioBuckets['Software Engineering'] = [];
            bioBuckets['Mechanical Engineering'] = [];
            bioBuckets['Manufacturing Engineering'] = [];

            var addBioToTeamBucket = function(bio, team) {

                if (bioBuckets[team].length === 0) {
                    bioBuckets[team].push(bio);
                    return;
                }

                var priority = getTeamPriority(bio, team);

                for (var i = 0; i < bioBuckets[team].length; i++) {

                    var currentPriority = getTeamPriority(bioBuckets[team][i], team);

                    if (priority > currentPriority) {
                        bioBuckets[team].splice(i, 0, bio);
                        return;
                    }

                }

                //if we make it here, add bio to end of array
                bioBuckets[team].push(bio);
            };

            var getTeamPriority = function(bio, team) {
                if (typeof bio === 'undefined') {
                    return Number.MIN_VALUE;
                }

                for (var i = 0; i < bio.teams.length; i++) {
                    if (bio.teams[i].team === team) {
                        return bio.teams[i].priority;
                    }
                }
            };

            $scope.bios = Bios.query().$promise.then(function(bios) {
                for (var i = 0; i < bios.length; i++) {

                    for (var j = 0; j < bios[i].teams.length; j++) {
                        addBioToTeamBucket(bios[i], bios[i].teams[j].team);
                        //bioBuckets[bios[i].teams[j].team].push(bios[i]);
                    }
                }
            });

            $scope.bioBuckets = bioBuckets;


		};

        $scope.sortBio = function(team) {

            return function(bio) {
                for (var i = 0; i < bio.teams.length; i++) {

                    if (bio.teams[i].team === team) {
                        console.log(bio.teams[i].priority);
                        return bio.teams[i].priority;
                    }
                }
            };
        };

		// Find existing Bio
		$scope.findOne = function() {

            $scope.initSelectedTeams();

            $scope.bio = Bios.get({
				bioId: $stateParams.bioId
			}, function(bio) {
                readTeamsFromBioToSelected(bio);
            });
		};
	}
]);
