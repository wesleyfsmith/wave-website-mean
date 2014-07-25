'use strict';

var fs = require('fs-extra');
var formidable = require('formidable');

/**
 * get a form with file(s) and save it
 */
exports.getFormSaveFiles = function(config, req, res, callback) {
    //create new form object
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        for (var key in config.formProps) {
            config.formProps[key] = fields[key];
        }
    });

    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;

        config.file_name = file_name;

        /* Location where we want to copy the uploaded file */
        var new_location = 'public' + config.folderPath;

        fs.copy(temp_path, new_location + file_name, function (err) {
            if (err) {
                callback(err, config, req, res);
            } else {
                callback(null, config, req, res);
            }
        });
    });
};