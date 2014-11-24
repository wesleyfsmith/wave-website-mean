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
    publication: {
        type: String,
        default: '',
        required: 'Please fill in publication name',
        trim: true
    },
    teaserContent: {
        type: String,
        required: 'Please add some teaser content',
        trim: true
    },
    url: {
        type: String,
        required: 'Please add original url',
        trim: true
    },
    publishDate: {
        type: String,
        required: 'Please enter the public date',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Story', StorySchema);