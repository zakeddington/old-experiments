/**
 * AppController
 * 
 * @author 
 * @since  
 */

var AppRouter          = require('./routers/AppRouter');
var ScoreModel         = require('./models/ScoreModel');
var AppConfig          = require('./config/AppConfig');
var HomeView           = require('./views/homeView/HomeView');
var GameView           = require('./views/gameView/GameView');
var ScoreView          = require('./views/scoreView/ScoreView');
var Sound              = require('./utils/Sound');

var AppController = {

	/**
	 * router 
	 * @type {AppRouter}
	 */
	appRouter          : null,

	$sectionContainer  : null, 

	homeView           : null,  
	gameView           : null, 
	scoreView          : null, 

	/**
	 * view holders
	 * @type {View}
	 */
	_curView           : null,


	/**
	 * Initializes the application
	 * @return {void}
	 */
	initialize: function () {
		this.$sectionContainer = $('#section-container');

		var scoreModel = new ScoreModel();

		//hold our height for references elsewhere
		AppConfig.stageHeight = $('#main-container').height();

		// create child views
		this.homeView = new HomeView({
			model: scoreModel
		});
		this.gameView = new GameView({
			model: scoreModel
		});
		this.scoreView = new ScoreView({
			model: scoreModel
		});

		//set up the router
		this.appRouter = new AppRouter({ appController: this });

		//load sounds
		Sound.loadSounds();
		
		this._startApp();
	},

	//********************
	// METHODS
	//********************

	/**
	 * remove the old view
	 */
	_removeView: function() {
		if ( _.isUndefined( this._curView ) || _.isNull( this._curView )) return;

		//if we have a current view, kill it off first
		if ( this._curView ) {
			this._curView.uninit();
		} 
	}, 

	/**
	 * start up our router which will initialize the app
	 */
	_startApp: function() {
		this.appRouter.start();
	}, 

	/**
	 * called from our router and used to set the section we should be displaying
	 * @param {string} routeStr the route string we want to move to
	 */
	setSection: function(routeStr) {
		var viewName = routeStr + "View";

		//get rid of our old view if it exists
		if ( this._curView !== null ) this._removeView();
	
		//render out our current view
		this._curView = this[viewName];
	
		if ( this._curView ) {
			this._curView.render();
			this.$sectionContainer.html( this._curView.el );
		}

		$('body').removeClass();
		$('body').addClass( routeStr );
	}

	
	//****************
	// EVENTS
	//****************

};

module.exports = AppController;
