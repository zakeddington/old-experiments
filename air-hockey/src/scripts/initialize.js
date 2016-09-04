/**
 * Application Initializer
 * 
 * @author 
 * @since  
 */

var AppController	= require('./AppController');
var AppConfig		= require('./config/AppConfig');
var PreloadView		= require('./views/preloadView/PreloadView');

$(function() {
	//check to see if we need to preload
	if( AppConfig.preload ) {
		var mainContainer = $('#main-container');
		var preloadView =   new PreloadView({ 
								onComplete: function() { 
									AppController.initialize(); 
								} 
							});

		preloadView.render();
		mainContainer.append( preloadView.el );
		preloadView.preloadAssets();

	} else {
		// Initialize Application
		AppController.initialize();
	}
});
