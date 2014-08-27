'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    photo: {
        type: String,
        required: 'Please attach a photo to this project'
    },
    content: {
        type: String,
        required: 'Please add a description for this project'
    }
});

mongoose.model('Project', ProjectSchema);