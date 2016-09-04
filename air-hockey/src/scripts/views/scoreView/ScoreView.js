/**
 * @type {Class}
 */
var BaseView      = require('../../supers/BaseView');
var template      = require('./ScoreViewTemplate.hbs'); 
var Utils         = require('../../utils/Utils');
var AppConfig     = require('../../config/AppConfig');
var AppEvent      = require('../../events/AppEvents');

var ScoreView = BaseView.extend({

	id            : 'score-view', 
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

		this.$el.html( this.template( this.model ) );

		this.$winner = this.$el.find('#winner');

		this._addListeners();
		
		return this;
	}, 

	//*******************
	// METHODS
	//*******************


	//*******************
	// EVENTS
	//*******************
	_addListeners: function() {

	}, 

	_removeListeners: function() {
		
	}

});
module.exports = ScoreView;