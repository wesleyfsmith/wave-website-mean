'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Story Schema
 */
var StorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Story name',
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
    //don't know if this should be media or photo or what
    //possibly later make this an array
    medium: {
        type: Schema.ObjectId,
        ref: 'Medium'
    }
});

mongoose.model('Story', StorySchema);