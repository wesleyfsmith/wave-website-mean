'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Bio = mongoose.model('Bio'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    Medium = mongoose.model('Medium');


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Bio already exists';
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
 * Create a Bio
 */
exports.create = function(req, res) {
    var bio = new Bio(req.body);
    bio.user = req.user;

    bio.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(bio);
        }
    });
};

/**
 * Show the current Bio
 */
exports.read = function(req, res) {
    res.jsonp(req.bio);
};

/**
 * Update a Bio
 */
exports.update = function(req, res) {
    var bio = req.bio ;

    bio = _.extend(bio , req.body);

    bio.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(bio);
        }
    });
};

/**
 * Delete an Bio
 */
exports.delete = function(req, res) {
    var bio = req.bio ;

    bio.remove(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(bio);
        }
    });
};

/**
 * List of Bios
 */
exports.list = function(req, res) {
    //init server data

    //clear first
    Bio.remove(function(err, bio){

    });

    var bios = require('./waveExports.json');
    for(var i = 0; i < bios.length; i++){
        var data = bios[i];

        var medium = new Medium();

        /* The file name of the uploaded file */
        var file_name = medium._id;

        var tmp = data.photo.split('.');

        var suffix = '.' + tmp[tmp.length - 1];

        /* Location where we want to copy the uploaded file */
        var new_location = 'public/media/';

        fs.copy('public/modules/bios/img/' + data.photo, new_location + file_name + suffix, function (err) {
            if (err) {
                console.log(err);
            } else {
                medium.src = '/media/' + file_name + suffix;

                medium.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        data.medium = medium._id;
                        var bio = new Bio(data);
                        bio.save(function(err) {
                            if (err) {
                                console.log(err);
                            } else {

                            }
                        });
                    }
                });
            }
        });
    }

    Bio.find().sort('number').populate('user', 'displayName').populate('medium', 'src').exec(function(err, bios) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(bios);
        }
    });
};

/**
 * Bio middleware
 */
exports.bioByID = function(req, res, next, id) {
    Bio.findById(id).populate('user', 'displayName').exec(function(err, bio) {
        if (err) return next(err);
        if (! bio) return next(new Error('Failed to load Bio ' + id));
        req.bio = bio ;
        next();
    });
};

/**
 * Bio authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.bio.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};