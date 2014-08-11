'use strict';

var options = {
    tmpDir: __dirname + '/../../public/uploads/tmp',
    uploadDir: __dirname + '/../../public/uploads',
    uploadUrl: '/uploads/',
    storage: {
        type: 'local'
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

/**
 * Create a article
 */
exports.create = function(req, res) {
    uploader.post(req, res, function (obj) {
        res.send(JSON.stringify(obj));
    });
};

exports.list = function(req, res) {
    uploader.get(req, res, function (obj) {
        res.send(JSON.stringify(obj));
    });
};

/**
 * Delete an upload
 */
exports.delete = function(req, res) {
    uploader.delete(req, res, function (obj) {
        res.send(JSON.stringify(obj));
    });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};