'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Bio Schema
 */
var BioSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Bio name',
		trim: true
	},
    title: {
        type: String,
        default: '',
        required: 'Please fill Title name',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
    number: {
        type: Number,
        required:true
    },
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    photo: {
        type: String,
        required: 'Please select an image.'
    },
    team: {
        type: [String],
        required: 'Please select a team for this bio.'
    }
});

var Bio = mongoose.model('Bio', BioSchema);