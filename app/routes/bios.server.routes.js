'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var bios = require('../../app/controllers/bios');

	// Bios Routes
	app.route('/bios')
		.get(bios.list)
		.post(users.requiresLogin, bios.create);

	app.route('/bios/:bioId')
		.get(bios.read)
		.put(users.requiresLogin, bios.hasAuthorization, bios.update)
		.delete(users.requiresLogin, bios.hasAuthorization, bios.delete);

	// Finish by binding the Bio middleware
	app.param('bioId', bios.bioByID);


    app.route('/bios_init')
        .get(users.requiresLogin, bios.init);
};