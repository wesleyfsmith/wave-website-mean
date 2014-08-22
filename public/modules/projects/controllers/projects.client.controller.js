'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Projects', 'Media', 'Uploads',
	function($scope, $upload, $stateParams, $location, Authentication, Projects, Media, Uploads ) {
		$scope.authentication = Authentication;

        $scope.onFileSelect = function ($files){
            $scope.photoPath = $files[0];
        };

		// Remove existing Project
		$scope.remove = function( project ) {
			if ( project ) { project.$remove();

				for (var i in $scope.projects ) {
					if ($scope.projects [i] === project ) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.delete(project.photo).success(function(data) {
                project.$update(function() {
                    $location.path('projects/' + project._id);
                }, errorFunction);
            }).error(errorFunction);
		};


        $scope.create = function() {
            var project = new Projects({
                name: this.name,
                content: this.content
            });

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.upload($scope.photoPath).success(function(data) {
                project.photo = data.files[0].url;
                project.$save(function(response) {
                    $location.path('projects/' + response._id);
                }, errorFunction);
            }).error(errorFunction);

            // Clear form fields
            this.name = '';
            this.content = '';
            $scope.photoPath = '';
        };

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			});
		};

        $scope.selectProject = function(project) {
            $scope.mouseOverProjectId = project._id;
            console.log(project._id);
        };

        $scope.projectIsSelected = function(project) {
            return $scope.mouseOverProjectId === project._id;
        };
	}
]);