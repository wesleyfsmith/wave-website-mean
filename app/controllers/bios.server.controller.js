'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Bio = mongoose.model('Bio'),
    _ = require('lodash');


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
    /* Create object after form uploads and file copies */
    formUpload.getFormSaveFiles({
        folderPath: '/modules/bios/img/',
        formProps: {
            photo:null,
            name:null,
            title:null,
            number:null
        }
    }, req, res, function(err, config, req, res){
        if(err){
            console.log(err);
        } else{
            req.body.photo = config.folderPath + config.file_name;
            req.body.name = config.formProps.name;
            req.body.title = config.formProps.title;
            req.body.number = config.formProps.number;

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
exports.list = function(req, res) { Bio.find().sort('number').populate('user', 'displayName').exec(function(err, bios) {
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