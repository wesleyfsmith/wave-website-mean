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
    content: {
        type: String
    },
    //don't know if this should be media or photo or what
    //possibly later make this an array
    medium: {
        type: Schema.ObjectId,
        ref: 'Medium'
    }
});

mongoose.model('Project', ProjectSchema);