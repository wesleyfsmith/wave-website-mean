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
    //don't know if this should be media or photo or what
    //possibly later make this an array
    medium: {
        type: Schema.ObjectId,
        ref: 'Medium'
    }
});

var Bio = mongoose.model('Bio', BioSchema);

////init server data

//clear first
//Bio.remove(function(err, bio){
//
//});
//
//var bios = require('./waveExports.json');
//for(var i = 0; i < bios.length; i++){
//    bios[i].photo = 'modules/bios/img/' + bios[i].photo;
//    var bio = new Bio(bios[i]);
//    bio.save();
//}