'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Bio = mongoose.model('Bio'),
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
    var tempName = '';
    var tempTitle = '';
    var tempNumber = '';

    //create new form object
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        tempName = fields.name;
        tempTitle = fields.title;
        tempNumber = fields.number;
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
            req.body.photo = '/modules/core/img/' + file_name;
            req.body.name = tempName;
            req.body.title = tempTitle;
            req.body.number = tempNumber;

            console.log(req.body);

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
        })();
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