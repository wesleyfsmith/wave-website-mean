'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    uploads = require('../../app/controllers/uploads');

module.exports = function(app) {

    app.route('/uploads')
        .get(uploads.list)
        .post(uploads.create);

    app.route('/uploads/:uploadName')
        .delete(uploads.delete);
};