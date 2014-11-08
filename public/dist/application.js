'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'wave-website';
    var applicationModuleVendorDependencies = [
        'textAngular',
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngCookies',
        'angularFileUpload'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('bios');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('jobs');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('partners');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stories');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('bios').run([
  'Menus',
  function (Menus) {
    //		Set top bar menu items
    /**
         * Don't do anythong in here for now we'll fix this later
         * TODO fix this crap
         */
    Menus.addMenuItem('topbar', 'Our Team', 'bios', 'dropdown', '/bios(/create)?', true);
    //friggin' order of parameters is screwed up
    Menus.addSubMenuItem('topbar', 'bios', 'View Our Team', 'bios', null, true);
    Menus.addSubMenuItem('topbar', 'bios', 'New Bio', 'bios/create', null, false);
  }
]);'use strict';
//Setting up route
angular.module('bios').config([
  '$stateProvider',
  function ($stateProvider) {
    // Bios state routing
    $stateProvider.state('listBios', {
      url: '/bios',
      templateUrl: 'modules/bios/views/list-bios.client.view.html'
    }).state('createBio', {
      url: '/bios/create',
      templateUrl: 'modules/bios/views/create-bio.client.view.html'
    }).state('viewBio', {
      url: '/bios/:bioId',
      templateUrl: 'modules/bios/views/view-bio.client.view.html'
    }).state('editBio', {
      url: '/bios/:bioId/edit',
      templateUrl: 'modules/bios/views/edit-bio.client.view.html'
    });
  }
]);'use strict';
// Bios controller
angular.module('bios').controller('BiosController', [
  '$scope',
  '$upload',
  '$stateParams',
  '$location',
  'Authentication',
  'Bios',
  'Uploads',
  function ($scope, $upload, $stateParams, $location, Authentication, Bios, Uploads) {
    $scope.authentication = Authentication;
    $scope.allowFullScreen(false);
    $scope.onFileSelect = function ($files) {
      $scope.photo = $files[0];
    };
    $scope.initSelectedTeams = function () {
      var selectedTeams = {};
      selectedTeams['Executive'] = false;
      selectedTeams['Board of Directors'] = false;
      selectedTeams['Power Electronics Engineering'] = false;
      selectedTeams['Software Engineering'] = false;
      selectedTeams['Mechanical Engineering'] = false;
      selectedTeams['Manufacturing Engineering'] = false;
      $scope.selectedTeams = selectedTeams;
    };
    var arrayContains = function (array, value) {
      if (array.indexOf(value) === -1) {
        return false;
      }
      return true;
    };
    var readTeamsFromBioToSelected = function (bio) {
      for (var team in $scope.selectedTeams) {
        if (arrayContains(bio.teams, team)) {
          $scope.selectedTeams[team] = true;
        }
      }
    };
    var addSelectedTeamsToBio = function (bio) {
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
    $scope.selectBio = function (bio) {
      //variable to keep track of currently clicked bio
      $scope.mouseOverBioId = bio._id;
      //store current bio name
      $scope.displayBioName = bio.name;
      //store current bio title
      $scope.displayBioTitle = bio.title;
    };
    $scope.isSelected = function (bioID) {
      return $scope.mouseOverBioId === bioID;
    };
    // Create new Bio
    $scope.create = function () {
      var bio = new Bios({
          name: this.name,
          title: this.title,
          teams: []
        });
      addSelectedTeamsToBio(bio);
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      Uploads.upload($scope.photo).success(function (data) {
        bio.photo = data.files[0].url;
        bio.$save(function (response) {
          $location.path('bios/' + response._id);
        }, errorFunction);
      }).error(errorFunction);
      // Clear form fields
      this.name = '';
      this.title = '';
    };
    // Remove existing Bio
    $scope.remove = function (bio) {
      if (bio) {
        bio.$remove();
        for (var i in $scope.bios) {
          if ($scope.bios[i] === bio) {
            $scope.bios.splice(i, 1);
          }
        }
      } else {
        $scope.bio.$remove(function () {
          $location.path('bios');
        });
      }
    };
    // Update existing Bio
    $scope.update = function () {
      var bio = $scope.bio;
      addSelectedTeamsToBio(bio);
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      var updateBio = function () {
        bio.$update(function () {
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
    $scope.find = function () {
      //sort them
      var bioBuckets = {};
      bioBuckets['Executive'] = [];
      bioBuckets['Board of Directors'] = [];
      bioBuckets['Power Electronics Engineering'] = [];
      bioBuckets['Software Engineering'] = [];
      bioBuckets['Mechanical Engineering'] = [];
      bioBuckets['Manufacturing Engineering'] = [];
      $scope.bios = Bios.query().$promise.then(function (bios) {
        for (var i = 0; i < bios.length; i++) {
          for (var j = 0; j < bios[i].teams.length; j++) {
            bioBuckets[bios[i].teams[j]].push(bios[i]);
          }
        }
      });
      $scope.bioBuckets = bioBuckets;
    };
    // Find existing Bio
    $scope.findOne = function () {
      $scope.initSelectedTeams();
      $scope.bio = Bios.get({ bioId: $stateParams.bioId }, function (bio) {
        readTeamsFromBioToSelected(bio);
      });
    };
  }
]);'use strict';
//Bios service used to communicate Bios REST endpoints
angular.module('bios').factory('Bios', [
  '$resource',
  function ($resource) {
    return $resource('bios/:bioId', { bioId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('FullScreenController', [
  '$scope',
  function ($scope) {
    // Using angular UIs nesting feature, this allows the child scope to
    // toggle whether or not the 'container' class is being added
    // for that view
    $scope.allowFullScreen = function (shouldAllow) {
      $scope.shouldAllowFullScreen = shouldAllow;
      this.$on('$destroy', function () {
        $scope.shouldAllowFullScreen = !shouldAllow;
      });
    };
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.allowFullScreen(true);
    $scope.tweets = [];
    $http.get('/tweets').success(function (data, status, headers, config) {
      $scope.tweets = data.statuses;
    });
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles || this.defaultRoles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles || this.defaultRoles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Uploads', [
  '$upload',
  '$http',
  function ($upload, $http) {
    this.upload = function (filePath) {
      return $upload.upload({
        url: '/uploads',
        method: 'POST',
        data: {},
        withCredentials: true,
        file: filePath
      });
    };
    this.delete = function (uploadUrl) {
      return $http.delete(uploadUrl);
    };
    this.updatePhoto = function (newPath, photoObj, saveCallback) {
      $http.delete(photoObj.photo).success(function (data) {
        $upload.upload({
          url: '/uploads',
          method: 'POST',
          data: {},
          withCredentials: true,
          file: newPath
        }).success(function (data) {
          photoObj.photo = data.files[0].url;
          saveCallback();
        });
      });
    };
  }
]);'use strict';
// Configuring the Articles module
angular.module('jobs').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Jobs', 'jobs', 'dropdown', '/jobs(/create)?');
    Menus.addSubMenuItem('topbar', 'jobs', 'List Jobs', 'jobs');
    Menus.addSubMenuItem('topbar', 'jobs', 'New Job', 'jobs/create');
  }
]);'use strict';
//Setting up route
angular.module('jobs').config([
  '$stateProvider',
  function ($stateProvider) {
    // Jobs state routing
    $stateProvider.state('listJobs', {
      url: '/jobs',
      templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
    }).state('createJob', {
      url: '/jobs/create',
      templateUrl: 'modules/jobs/views/create-job.client.view.html'
    }).state('viewJob', {
      url: '/jobs/:jobId',
      templateUrl: 'modules/jobs/views/view-job.client.view.html'
    }).state('editJob', {
      url: '/jobs/:jobId/edit',
      templateUrl: 'modules/jobs/views/edit-job.client.view.html'
    });
  }
]);'use strict';
// Jobs controller
angular.module('jobs').controller('JobsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Jobs',
  '$anchorScroll',
  function ($scope, $stateParams, $location, Authentication, Jobs, $anchorScroll) {
    $scope.authentication = Authentication;
    // Create new Job
    $scope.create = function () {
      // Create new Job object
      var job = new Jobs({
          name: this.name,
          responsibilities: this.responsibilities,
          description: this.description,
          qualifications: this.qualifications
        });
      // Redirect after save
      job.$save(function (response) {
        $location.path('jobs/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.name = '';
      this.responsibilities = '';
      this.description = '';
      this.qualifications = '';
    };
    // Remove existing Job
    $scope.remove = function (job) {
      if (job) {
        job.$remove();
        for (var i in $scope.jobs) {
          if ($scope.jobs[i] === job) {
            $scope.jobs.splice(i, 1);
          }
        }
      } else {
        $scope.job.$remove(function () {
          $location.path('jobs');
        });
      }
    };
    // Update existing Job
    $scope.update = function () {
      var job = $scope.job;
      job.$update(function () {
        $location.path('jobs/' + job._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Jobs
    $scope.find = function () {
      $scope.jobs = Jobs.query();
    };
    // Find existing Job
    $scope.findOne = function () {
      $scope.job = Jobs.get({ jobId: $stateParams.jobId });
    };
    $scope.scrollToJob = function (id) {
      $location.hash(id);
      $anchorScroll();
    };
  }
]);'use strict';
//Jobs service used to communicate Jobs REST endpoints
angular.module('jobs').factory('Jobs', [
  '$resource',
  function ($resource) {
    return $resource('jobs/:jobId', { jobId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('partners').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Partners', 'partners', 'dropdown', '/partners(/create)?');
    Menus.addSubMenuItem('topbar', 'partners', 'List Partners', 'partners');
    Menus.addSubMenuItem('topbar', 'partners', 'New Partner', 'partners/create');
  }
]);'use strict';
//Setting up route
angular.module('partners').config([
  '$stateProvider',
  function ($stateProvider) {
    // Partners state routing
    $stateProvider.state('listPartners', {
      url: '/partners',
      templateUrl: 'modules/partners/views/list-partners.client.view.html'
    }).state('createPartner', {
      url: '/partners/create',
      templateUrl: 'modules/partners/views/create-partner.client.view.html'
    }).state('viewPartner', {
      url: '/partners/:partnerId',
      templateUrl: 'modules/partners/views/view-partner.client.view.html'
    }).state('editPartner', {
      url: '/partners/:partnerId/edit',
      templateUrl: 'modules/partners/views/edit-partner.client.view.html'
    });
  }
]);'use strict';
// Partners controller
angular.module('partners').controller('PartnersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Partners',
  'Uploads',
  function ($scope, $stateParams, $location, Authentication, Partners, Uploads) {
    $scope.authentication = Authentication;
    // Create new Partner
    $scope.create = function () {
      // Create new Partner object
      var partner = new Partners({ name: this.name });
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      Uploads.upload($scope.photo).success(function (data) {
        partner.photo = data.files[0].url;
        partner.$save(function (response) {
          $location.path('partners/' + response._id);
        }, errorFunction);
      });
      // Clear form fields
      this.name = '';
    };
    // Remove existing Partner
    $scope.remove = function (partner) {
      if (partner) {
        partner.$remove();
        for (var i in $scope.partners) {
          if ($scope.partners[i] === partner) {
            $scope.partners.splice(i, 1);
          }
        }
      } else {
        $scope.partner.$remove(function () {
          $location.path('partners');
        });
      }
    };
    // Update existing Partner
    $scope.update = function () {
      var partner = $scope.partner;
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      var updatePartner = function () {
        partner.$update(function () {
          $location.path('partners/' + partner._id);
        }, errorFunction);
      };
      if (typeof $scope.photo !== 'undefined') {
        Uploads.updatePhoto($scope.photo, partner, updatePartner);
      } else {
        updatePartner();
      }
      partner.$update(function () {
        $location.path('partners/' + partner._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Partners
    $scope.find = function () {
      $scope.partners = Partners.query();
    };
    // Find existing Partner
    $scope.findOne = function () {
      $scope.partner = Partners.get({ partnerId: $stateParams.partnerId });
    };
  }
]);'use strict';
//Partners service used to communicate Partners REST endpoints
angular.module('partners').factory('Partners', [
  '$resource',
  function ($resource) {
    return $resource('partners/:partnerId', { partnerId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('projects').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
    Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
    Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
  }
]);'use strict';
//Setting up route
angular.module('projects').config([
  '$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/views/list-projects.client.view.html'
    }).state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/views/create-project.client.view.html'
    }).state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/views/view-project.client.view.html'
    }).state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/views/edit-project.client.view.html'
    });
  }
]);'use strict';
// Projects controller
angular.module('projects').controller('ProjectsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Projects',
  'Uploads',
  function ($scope, $stateParams, $location, Authentication, Projects, Uploads) {
    $scope.authentication = Authentication;
    $scope.onFileSelect = function ($files) {
      $scope.photo = $files[0];
    };
    // Create new Project
    $scope.create = function () {
      // Create new Project object
      var project = new Projects({
          name: this.name,
          content: this.content
        });
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      Uploads.upload($scope.photo).success(function (data) {
        project.photo = data.files[0].url;
        project.$save(function (response) {
          $location.path('projects/' + response._id);
        }, errorFunction);
      });
      // Clear form fields
      this.name = '';
      this.content = '';
    };
    // Remove existing Project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();
        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          $location.path('projects');
        });
      }
    };
    // Update existing Project
    $scope.update = function () {
      var project = $scope.project;
      var errorFunction = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };
      var updateProject = function () {
        project.$update(function () {
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
    $scope.find = function () {
      $scope.projects = Projects.query();
    };
    // Find existing Project
    $scope.findOne = function () {
      $scope.project = Projects.get({ projectId: $stateParams.projectId });
    };
  }
]);'use strict';
//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', [
  '$resource',
  function ($resource) {
    return $resource('projects/:projectId', { projectId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('stories').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Stories', 'stories', 'dropdown', '/stories(/create)?', true);
    Menus.addSubMenuItem('topbar', 'stories', 'List Stories', 'stories', null, true);
    Menus.addSubMenuItem('topbar', 'stories', 'New Story', 'stories/create', null, false);
  }
]);'use strict';
//Setting up route
angular.module('stories').config([
  '$stateProvider',
  function ($stateProvider) {
    // Stories state routing
    $stateProvider.state('listStories', {
      url: '/stories',
      templateUrl: 'modules/stories/views/list-stories.client.view.html'
    }).state('createStory', {
      url: '/stories/create',
      templateUrl: 'modules/stories/views/create-story.client.view.html'
    }).state('viewStory', {
      url: '/stories/:storyId',
      templateUrl: 'modules/stories/views/view-story.client.view.html'
    }).state('editStory', {
      url: '/stories/:storyId/edit',
      templateUrl: 'modules/stories/views/edit-story.client.view.html'
    });
  }
]);'use strict';
// Stories controller
angular.module('stories').controller('StoriesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Stories',
  function ($scope, $stateParams, $location, Authentication, Stories) {
    $scope.authentication = Authentication;
    // Create new Story
    $scope.create = function () {
      // Create new Story object
      var story = new Stories({ name: this.name });
      // Redirect after save
      story.$save(function (response) {
        $location.path('stories/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.name = '';
    };
    // Remove existing Story
    $scope.remove = function (story) {
      if (story) {
        story.$remove();
        for (var i in $scope.stories) {
          if ($scope.stories[i] === story) {
            $scope.stories.splice(i, 1);
          }
        }
      } else {
        $scope.story.$remove(function () {
          $location.path('stories');
        });
      }
    };
    // Update existing Story
    $scope.update = function () {
      var story = $scope.story;
      story.$update(function () {
        $location.path('stories/' + story._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Stories
    $scope.find = function () {
      $scope.stories = Stories.query();
    };
    // Find existing Story
    $scope.findOne = function () {
      $scope.story = Stories.get({ storyId: $stateParams.storyId });
    };
  }
]);'use strict';
//Stories service used to communicate Stories REST endpoints
angular.module('stories').factory('Stories', [
  '$resource',
  function ($resource) {
    return $resource('stories/:storyId', { storyId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);