/**
 * Created by wesley on 7/28/14.
 */
'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Media', ['$resource',
    function($resource) {
        return $resource('media/:mediaId', {
            mediaId: '@_id'
        });
    }
]);