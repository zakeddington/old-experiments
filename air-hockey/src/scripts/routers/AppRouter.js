/**
 * Primary app router
 * 
 * @author 
 * @since 
 */

var AppController = require('../AppController');

/**
 * @type {Class}
 */
var AppRouter = Backbone.Router.extend({

	/**
	 * Ref to primary Application controller
	 * @type {AppController}
	 */
	appController: null,

	routes: {
		''					: 'indexRoute',
		'game'				: 'gameRoute',
		'score'				: 'scoreRoute'
	},

	initialize: function( options ) {
		_.bindAll( this );
		this.appController = options.appController;
	},

	//********************
	// ROUTING METHODS
	//********************
	indexRoute: function() {
		this.appController.setSection('home');
	},
	gameRoute: function() {
		this.appController.setSection('game');
	}, 
	scoreRoute: function() {
		this.appController.setSection('score');
	}, 
	
	start: function() {
		Backbone.history.start({});
	}
});

module.exports = AppRouter;