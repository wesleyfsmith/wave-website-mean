'use strict';

//Menu service used for managing  menus
angular.module('core').service('Uploads', ['$upload', '$http',
    function($upload, $http) {
        this.upload = function(filePath) {
            return $upload.upload({
                url: '/uploads',
                method: 'POST',
                data: {},
                withCredentials: true,
                file: filePath
            });
        };
        this.delete = function(uploadUrl) {
            return $http.delete(uploadUrl);
        };
    }
]);