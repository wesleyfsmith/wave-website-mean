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
        this.updatePhoto = function(oldFile, newPath, photoObj) {
            if (typeof newPath !== 'undefined') {
                $http.delete(oldFile).success(function (data) {
                    $upload.upload({
                        url: '/uploads',
                        method: 'POST',
                        data: {},
                        withCredentials: true,
                        file: filePath
                    }).success(function (data) {
                        photoObj.photo = data.files[0].url;
                    });
                });
            }
            //otherwise they want to keep the same photo
            return null;
        }
    }
]);