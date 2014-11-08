module.exports = function(app) {

    var users = require('../../app/controllers/users');
    var bios = require('../../app/controllers/bios');
    var projects = require('../../app/controllers/projects');
    var jobs = require('../../app/controllers/jobs');

    //routes to read in data from json file
    app.route('/init')
        .get(users.requiresLogin, function(req, res) {
            bios.init(req, res);
            projects.init(req, res);
            jobs.init(req, res);
        });
};