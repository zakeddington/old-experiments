
module.exports = function(grunt) {

	var path = require('path');
	var defaultLocal = './local';
	var defaultPublic = './public';


	// Project configuration.
	grunt.initConfig({


		/* GENERAL CONFIG OPTIONS */

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Local compiled folder, dev/debug environment
		 * @type {String}
		 */
		localPath: grunt.option('localPath') || defaultLocal,

		/**
		 * Local compiled folder, production/published files
		 * @type {String}
		 */
		publicPath: grunt.option('publicPath') || defaultPublic,

		/**
		 * _ui directory name (holds js/css compiled output)
		 * @type {String}
		 */
		uiDir: 'assets',

		/**
		 * Compiled js path/destination
		 * @type {String}
		 */
		jsOutputPath: '<%= uiDir %>/js',

		/**
		 * Compiled CSS path/destination
		 * @type {String}
		 */
		cssOutputPath: '<%= uiDir %>/css',

		/**
		 * Path to source (uncompiled) files
		 * @type {String}
		 */
		sourcePath: './src',

		/**
		 * Path to 3rd party/vendor js libs
		 * @type {String}
		 */
		vendorPath: '<%= sourcePath %>/vendor',

		/**
		 * The port number to mount the node server on
		 * @type {Number}
		 */
		port: 3001,

		/**
		 * Port number that the livereload server is run on
		 * @type {Number}
		 */
		livereloadPort: 1337,



		/* TASK CONFIG */
		
		'browserify': {
			dev: {
				src: ['<%= sourcePath %>/scripts/initialize.js'],
				dest: '<%= localPath %>/<%= jsOutputPath %>/app.js',
				options: {
					transform: ['handleify'],
					debug: true
				}
			},
			dist: {
				src: [ '<%= sourcePath %>/scripts/initialize.js'],
				dest: '<%= publicPath %>/<%= jsOutputPath %>/app.js',
				options: {
					transform: ['handleify'],
					debug: false
				}
			}
		},
		
		'clean': {
			// development directory
			dev: '<%= localPath %>',

			// distribution directory
			dist: '<%= publicPath %>'
		},


		'concat': {
			dev: {
				options: {
				  separator: '\n\n'
				},
				src: [
					'<%= sourcePath %>/vendor/scripts/jquery.js',
					'<%= sourcePath %>/vendor/scripts/greensock.js', 
					'<%= sourcePath %>/vendor/scripts/underscore.js', 
					'<%= sourcePath %>/vendor/scripts/backbone.js',
					'<%= sourcePath %>/vendor/scripts/backbone.super.js', 
					'<%= sourcePath %>/vendor/scripts/preloadjs-0.3.1.min.js', 
					'<%= sourcePath %>/vendor/scripts/soundjs-0.5.2.min.js', 
					'<%= sourcePath %>/vendor/scripts/rAF.js', 
					'<%= sourcePath %>/vendor/scripts/tiny-pubsub.js'
				],
				dest: '<%= localPath %>/assets/js/lib/vendor.js'
				}, 
			dist: {
				options: {
				  separator: '\n\n'
				},
				src: [
				    '<%= sourcePath %>/vendor/scripts/jquery.js',
					'<%= sourcePath %>/vendor/scripts/greensock.js', 
					'<%= sourcePath %>/vendor/scripts/underscore.js', 
					'<%= sourcePath %>/vendor/scripts/backbone.js',
					'<%= sourcePath %>/vendor/scripts/backbone.super.js', 
					'<%= sourcePath %>/vendor/scripts/preloadjs-0.3.1.min.js', 
					'<%= sourcePath %>/vendor/scripts/soundjs-0.5.2.min.js', 
					'<%= sourcePath %>/vendor/scripts/rAF.js'
				],
				dest: '<%= publicPath %>/assets/js/lib/vendor.js'
			}
		},


		'connect': {
			dev: {
				options: {
					hostname: null,
					port: '<%= port %>',
					base: '<%= localPath %>',
					livereload: '<%= livereloadPort %>'
				}
			}
		},


		// copy over non-compiled files (assets, static html)
		'copy': {
			assets: {
				files: [
					// asset files (img, fonts, video)
					{
						expand: true,
						src: [
							'**/*',
						],
						dest: '<%= localPath %>/<%= uiDir %>',
						cwd: '<%= sourcePath %>/assets/'
					}
				]
			},

			html: {
				files: [
					// html files
					{
						expand: true,
						src: [
							'**/*.html'
						],
						dest: '<%= localPath %>',
						cwd: '<%= sourcePath %>/html/'
					}
				]
			},

			// copy modernizr separately so it can be loaded in the head before page, and other js files
			modernizr: {
				files: [
					// html files
					{
						expand: true,
						src: [
							'modernizr.js',
						],
						dest: '<%= localPath %>/<%= jsOutputPath %>/lib/',
						cwd: '<%= sourcePath %>/vendor/'
					}
				]
			},

			// dist target should copy over all files, since we don't need to target specific types for the watch task
			// should never include js files, js files are either copied by requirejs, browserify, or concat/uglify tasks
			// in both dev and dist environments
			dist: {
				files: [
					{
						expand: true,
						src: [
							'modernizr.js',
						],
						dest: '<%= publicPath %>/<%= jsOutputPath %>/lib/',
						cwd: '<%= sourcePath %>/vendor/'
					},
					{
						expand: true,
						src: [
							'**/*.js',
						],
						dest: '<%= publicPath %>/<%= jsOutputPath %>/include/',
						cwd: '<%= sourcePath %>/scripts/include/'
					}, 
					{
						expand: true,
						src: [
							'**/*',
						],
						dest: '<%= publicPath %>/<%= uiDir %>',
						cwd: '<%= sourcePath %>/assets/'
					},
					{
						expand: true,
						src: [
							'**/*.html',
						],
						dest: '<%= publicPath %>',
						cwd: '<%= sourcePath %>/html/'
					}
					
				]
			}
		},

		'jshint': {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				loopfunc: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					'console': true,
					'alert': true,
					'window': true,
					'module': true,
					'require': true,
					'$': true,
					'Modernizr': true,
					'_': true,
					'Backbone': true,
					'TweenMax': true,
					'Linear': true,
					'Back': true,
					'Cubic': true,
					'Quad': true,
					'Quart': true,
					'Quint': true,
					'Bounce': true,
					"Elastic": true, 
					'createjs': true
				}
			},
			all: [
			'<%= sourcePath %>/scripts/**/*.js'
			]
		},


		'sass': {
			dev: {
				options: {
					style: 'expanded',
					debug: true,
					trace: true
				},
				files: [{
					src: '<%= sourcePath %>/styles/app.scss',
					dest: '<%= localPath %>/<%= cssOutputPath %>/app.css'
				}]
			},
			dist: {
				options: {
					style: 'compressed',
					debug: false,
					trace: false
				},
				files: [{
					src: '<%= sourcePath %>/styles/app.scss',
					dest: '<%= publicPath %>/<%= cssOutputPath %>/app.css'
				}]
			}
		},


		'uglify': {
			js: {
				files: [{
					src: '<%= publicPath %>/<%= jsOutputPath %>/app.js',
					dest: '<%= publicPath %>/<%= jsOutputPath %>/app.js'
				}]
			}
		},


		'watch': {
			// generic options
			options: {
				livereload: '<%= livereloadPort %>', 
				spawn: false
			},
			// target specific
			css: {
				files: [
					'<%= sourcePath %>/styles/**/*.scss'
				],
				tasks: ['sass:dev']
			},
			js: {
				files: [
					'<%= sourcePath %>/scripts/**/*.js', 
					'<%= sourcePath %>/scripts/**/*.hbs'
				],
				tasks: ['jshint', 'processjs:dev']
			},
			vendor: {
				files: [
					'<%= sourcePath %>/vendor/**/*'
				],
				tasks: ['browserify:dev']
			},
			html: {
				files: [
					'<%= sourcePath %>/html/**/*.html'
				],
				tasks: ['copy:html']
			},
			assets: {
				files: [
					'<%= sourcePath %>/assets/**/*',
					'<%= localPath %>/assets/**/*'
				],
				tasks: ['copy:assets']
			}
		}
	});


	/**
	 * Compile files and start a static server from the 'local' directory
	 */
	grunt.registerTask('run', [
		'clean:dev', 
		'jshint',
		'copy:dev',
		'vendor:dev',
		'processjs:dev',
		'sass:dev',
		'connect',
		'watch'
	]);

	/**
	 * Compile files in a new clean build
	 */
	grunt.registerTask('build', [
		'clean:dist', 
		'jshint',
		'vendor:dist',
		'processjs:dist',
		'copy:dist',
		'sass:dist'
	]);


	/* TASK ALIASES */

	grunt.registerTask('copy:dev', [
		'copy:assets',
		'copy:html'
	]);

	grunt.registerTask('vendor:dev', [
		'copy:modernizr', 
		'concat:dev'
	]);

	grunt.registerTask('vendor:dist', [
		'copy:modernizr', 
		'concat:dist'
	]);

	grunt.registerTask('processjs:dev', [
		'browserify:dev'
	]);

	grunt.registerTask('processjs:dist', [
		'browserify:dist'
	]);


	/* LOAD TASK DEPENDENCIES */

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-browserify'); /* for some reason this task won't load automatically */

};