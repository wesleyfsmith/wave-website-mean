'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Partner = mongoose.model('Partner'),
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
				message = 'Partner already exists';
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
 * Create a Partner
 */
exports.create = function(req, res) {
	var partner = new Partner(req.body);
	partner.user = req.user;

	partner.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * Show the current Partner
 */
exports.read = function(req, res) {
	res.jsonp(req.partner);
};

/**
 * Update a Partner
 */
exports.update = function(req, res) {
	var partner = req.partner ;

	partner = _.extend(partner , req.body);

	partner.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * Delete an Partner
 */
exports.delete = function(req, res) {
	var partner = req.partner ;

	partner.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * List of Partners
 */
exports.list = function(req, res) { Partner.find().sort('-created').populate('user', 'displayName').exec(function(err, partners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(partners);
		}
	});
};

/**
 * Partner middleware
 */
exports.partnerByID = function(req, res, next, id) { Partner.findById(id).populate('user', 'displayName').exec(function(err, partner) {
		if (err) return next(err);
		if (! partner) return next(new Error('Failed to load Partner ' + id));
		req.partner = partner ;
		next();
	});
};

/**
 * Partner authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.partner.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};