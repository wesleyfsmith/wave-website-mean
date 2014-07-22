'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Projects',
	function($scope, $upload, $stateParams, $location, Authentication, Projects ) {
		$scope.authentication = Authentication;

        var file = '';

        $scope.onFileSelect = function ($files){
            file = $files[0];
        };

        $scope.renderHtml = function(html_code){
            return $sce.trustAsHtml(html_code);
        };

		// Create new Project
		$scope.create = function($files) {
            //var file = $files[0];

            //server side can handle anything!!!
            //#serverswag
            console.log($scope.myModelObj);
            $scope.upload = $upload.upload({
                url: '/projects',
                method: 'POST',
                withCredentials:true,
                data: {name: $scope.name, content: $scope.content},
                file:file
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                console.log('successful');

                console.log('you should be redirected right about now');
                $location.path('projects/' + data._id);
            }).error(function(err){
                $scope.error = err.data.message;
            });
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
			var project = $scope.project ;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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