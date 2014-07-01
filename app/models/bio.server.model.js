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
    photo: {
        type: String,
        required: true,
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
    number: {
        type: Number,
        required: true
    },
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var Bio = mongoose.model('Bio', BioSchema);

////init server data

//clear first
Bio.remove(function(err, bio){

});

var bios = require('/home/macsj200/waveExports.json');
for(var i = 0; i < bios.length; i++){
    var bio = new Bio(bios[i]);
    bio.save();
}