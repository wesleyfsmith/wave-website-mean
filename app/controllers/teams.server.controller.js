'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Team = mongoose.model('Team'),
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
				message = 'Team already exists';
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
 * Create a Team
 */
exports.create = function(req, res) {
	var team = new Team(req.body);
	team.user = req.user;

	team.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Show the current Team
 */
exports.read = function(req, res) {
	res.jsonp(req.team);
};

/**
 * Update a Team
 */
exports.update = function(req, res) {
	var team = req.team ;

	team = _.extend(team , req.body);

	team.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Delete an Team
 */
exports.delete = function(req, res) {
	var team = req.team ;

	team.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * List of Teams
 */
exports.list = function(req, res) { Team.find().sort('-created').populate('user', 'displayName').exec(function(err, teams) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(teams);
		}
	});
};

/**
 * Team middleware
 */
exports.teamByID = function(req, res, next, id) { Team.findById(id).populate('user', 'displayName').exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Team ' + id));
		req.team = team ;
		next();
	});
};

/**
 * Team authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.team.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};