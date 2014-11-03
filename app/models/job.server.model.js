'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Job name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	responsibilities: {
		type: String,
		default: '',
		required: 'Please add job responsibilities'
	},
	description: {
		type: String,
		default: '',
		required: 'Please add a job description'
	},
	qualifications: {
		type: String,
		default: '',
		required: 'Please add job qualifications'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Job', JobSchema);
