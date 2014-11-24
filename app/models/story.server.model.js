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
    teaserContent: {
        type: String,
        required: 'Please add some teaser content'
    },
    url: {
        type: String,
        required: 'Please add original url'
    }
});

mongoose.model('Story', StorySchema);