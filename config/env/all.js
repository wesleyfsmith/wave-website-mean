'use strict';

module.exports = {
	app: {
		title: 'wave-website',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
//				'public/lib/bootstrap/dist/css/bootstrap.css',
//				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/bootswatch/paper/bootstrap.css',
                'public/lib/components-font-awesome/css/font-awesome.css',
				'public/lib/angular-carousel/dist/angular-carousel.css'
			],
			js: [
                'public/lib/ng-file-upload/angular-file-upload-shim.js',
                'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/ng-file-upload/angular-file-upload.js',
                'public/lib/textAngular/src/textAngular-sanitize.js',
                'public/lib/textAngular/src/textAngularSetup.js',
                'public/lib/textAngular/src/textAngular.js',
                'public/lib/rangy/rangy-core.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/ng-grid/build/ng-grid.js',
				'public/lib/angular-carousel/dist/angular-carousel.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
