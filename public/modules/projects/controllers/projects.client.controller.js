'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'Uploads',
	function($scope, $stateParams, $location, Authentication, Projects, Uploads ) {
		$scope.authentication = Authentication;

        $scope.onFileSelect = function ($files){
            $scope.photo = $files[0];
        };

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: this.name,
                content: this.content
			});

            var errorFunction = function(errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            Uploads.upload($scope.photo).success(function(data) {
                project.photo = data.files[0].url;
                project.$save(function(response) {
                    $location.path('projects/' + response._id);
                }, errorFunction);
            });

			// Clear form fields
			this.name = '';
            this.content = '';
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

            var updateProject = function() {
                project.$update(function() {
                    $location.path('projects/' + project._id);
                }, errorFunction);
            };

            if (typeof $scope.photo !== 'undefined') {
                Uploads.updatePhoto($scope.photo, project, updateProject);
            } else {
                updateProject();
            }

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
	}
]);