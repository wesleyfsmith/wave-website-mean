var mongoose = require('mongoose');

module.exports = function(app) {

    var users = require('../../app/controllers/users');
    var bios = require('../../app/controllers/bios');
    var projects = require('../../app/controllers/projects');
    var jobs = require('../../app/controllers/jobs');
    var stories = require('../../app/controllers/stories');

    //routes to read in data from json file
    app.route('/init')
        .get(function(req, res) {

            mongoose.connection.db.dropDatabase();

            bios.init(req, res);
            projects.init(req, res);
            jobs.init(req, res);
            stories.init(req, res);
            res.jsonp('success');
        });
};
