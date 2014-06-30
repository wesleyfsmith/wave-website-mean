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
        default: 'img/defaultavatar.png',
        required: true,
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

var Bio = mongoose.model('Bio', BioSchema);

////init server data

//clear first
Bio.remove(function(err, bio){

});

//populate
var bioList = [];

bioList.push(new Bio({
    name: 'Wesley Smith',
    title: 'Chief Development Officer & Founder',
    photo: 'modules/bios/img/wesleysmithabout.png'
}));

for(var i = 0; i < bioList.length; i++){
    bioList[i].save(function(err, bio){
        if(err){
            console.log(err);
        }
    });
}