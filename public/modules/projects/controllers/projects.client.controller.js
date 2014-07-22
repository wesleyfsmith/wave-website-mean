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
            var storeName = this.name;
            var storeContent = this.content;

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
            }).error(function(err){
                console.log(err);
            });

			// Create new Project object
			var project = new Projects ({
				name: storeName,
                photoPath: this.photoPath,
                content: storeContent
			});

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
            this.photoPath = '';
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

        $scope.randomPicture = function() {
            switch (Math.floor((Math.random() * 2) + 1)) {
                case 1:
                    return '/modules/core/img/bus.jpg';
                case 2:
                    return '/modules/core/img/bus_gray.jpg';
                case 3:
                    return '/modules/core/img/bus_main.jpeg';
            }
        };
	}
]);