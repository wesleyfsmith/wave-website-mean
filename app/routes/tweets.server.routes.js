'use strict';

/**
 * Module dependencies.
 */
var tweets = require('../../app/controllers/tweets');

module.exports = function(app) {

    app.route('/tweets')
        .get(tweets.list);

};
