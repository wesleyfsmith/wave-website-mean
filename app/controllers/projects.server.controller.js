'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Project already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

/**
 * Create a Project
 */
exports.create = function(req, res) {
    var tempName = '';

    //create new form object
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        tempName = fields.name;
    });

    form.on('end', function(fields, files){
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'public/modules/core/img/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('success!');
            }
        });

        /* Create object after form uploads and file copies */
        (function(){
            req.body.photoPath = file_name;
            req.body.name = tempName;

            console.log(req.body);

            var project = new Project(req.body);
            project.user = req.user;

            project.save(function(err) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(project);
                }
            });
        })();
    });
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
    res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
    var project = req.project ;

    project = _.extend(project , req.body);

    project.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
    var project = req.project ;

    project.remove(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) { Project.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
    if (err) {
        return res.send(400, {
            message: getErrorMessage(err)
        });
    } else {
        res.jsonp(projects);
    }
});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
    if (err) return next(err);
    if (! project) return next(new Error('Failed to load Project ' + id));
    req.project = project ;
    next();
});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.project.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};