/**
 * Preloader View
 */

var Preloader	= require('../../utils/Preloader');
var AppEvents	= require('../../events/AppEvents');
var template	= require('./PreloadViewTemplate.hbs');
var Assets		= require('../../config/Assets');

/**
 * @type {Class}
 */
var PreloaderView = Backbone.View.extend({

	tagName     : 'div', 
	/**
	 * @type {String}
	 */
	id          : 'preloader-view',

	/**
	 * View template
	 * @type {Function}
	 */
	template    : template,

	onComplete  : null, 

	//********************
	// CONSTRUCTOR
	//********************

	/**
	 * Initialize the view
	 * @param  {Object} options
	 * @return {void}
	 */
	initialize: function( options ) {
		_.extend( this, options || {} );
		this.onComplete = options.onComplete;
	},

	//********************
	// PRIVATE METHODS
	//********************

	render: function() {
		this.$el.html( this.template() );
		return this;
	}, 

	/**
     * Preload all assets by calling PreloadJS wrapper
     * @return {void}
     */
    preloadAssets: function() {
		var self = this;
		var imgManifest = _.map( Assets.images, function( file, index ) {
			return {
				'src': Assets.imgPath + file,
				'id': 'image-' + index
			};
		});

		Preloader.initialize({
			'fileManifest': imgManifest,

			'onComplete': function() {
				self.onComplete.apply(null);
				self.remove();
			},

			'onError': function() {
				console.log('error');
			},

			'onProgress': function( event ) {
				var progress = Math.round( event.progress * 100 ) + '%';
				console.log(progress);
			}
        });

    }

    //********************
	// EVENTS
	//********************

});

module.exports = PreloaderView;
