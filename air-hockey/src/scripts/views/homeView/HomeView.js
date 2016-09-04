/**
 * @type {Class}
 */
var BaseView      = require('../../supers/BaseView');
var template      = require('./HomeViewTemplate.hbs'); 
var Utils         = require('../../utils/Utils');
var AppConfig     = require('../../config/AppConfig');
var AppEvent      = require('../../events/AppEvents');

var HomeView = BaseView.extend({

	id            : 'home-view', 
	template      : template,	

	/**
	 * @param  {Object} options 
	 * @return {void} 
	 */
	initialize: function( options ) {
		this._super();
	},

	uninit: function() {
		this._removeListeners();
		this._super();
	}, 

	render: function() {
		this._super();

		this.$el.html( this.template() );

		this.$form = this.$el.find('form');
		this.$name = this.$el.find('input[type=text]');

		this._addListeners();
		
		return this;
	},

	_startGame: function( e ) {
		this.model.player1 = this.$name.val();
		window.location.hash = 'game';
	},

	//*******************
	// METHODS
	//*******************


	//*******************
	// EVENTS
	//*******************
	_addListeners: function() {
		var self = this;

		this.$form.submit( function( e ) {
			e.preventDefault();
			self._startGame( e );
		});
	}, 

	_removeListeners: function() {
		
	}

});
module.exports = HomeView;