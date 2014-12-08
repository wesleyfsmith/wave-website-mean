'use strict';

var twitLibrary = require('twit');

var apiKeys = require('../../config/env/twitterKeys');

var twit = new twitLibrary(apiKeys);

exports.list = function(req, res) {
    twit.get('search/tweets', { q: '@waveipt', count: 5 }, function(err, data, response) {

        res.jsonp(data);

        //TODO: figure out this closure madness
        data = data.statuses;

        //var results = [];
        //
        //for (var i = 0; i < data.length; i++) {
        //    twit.get('statuses/oembed', {id: data[i].id}, function(err, data, response) {
        //        results.push(data);
        //        if (results.length === 5) {
        //            res.jsonp(results);
        //        }
        //    });
        //}
    });
};

var getTweetBody = function(count, results, res) {
    twit.get('statuses/oembed', {id: data[i].id}, function(err, data, response) {
        results.push(data)
    });
};