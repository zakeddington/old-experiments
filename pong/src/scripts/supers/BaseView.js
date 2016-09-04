/**
 * @type {Class}
 */

var BaseView = Backbone.View.extend({

	className: 'view',	

	/**
	 * @param  {Object} options 
	 * @return {void} 
	 */
	initialize: function( options ) {
		_.extend( this, options || {} );
		_.bindAll( this );
	},

	uninit: function() {
		this.undelegateEvents();
		TweenMax.killChildTweensOf(this.$el);
		this.remove();
	}, 


	render: function() {
		this.delegateEvents();
	}


	//*******************
	// EVENTS
	//*******************


});
module.exports = BaseView;