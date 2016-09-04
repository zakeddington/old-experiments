/**
 * @class
 */
var Utils = {

	isTouch          : false, 
	touchClickEvent  : 'click', 
	touchStartEvent  : 'mousedown', 
	touchMoveEvent   : 'mousemove', 
	touchEndEvent    : 'mouseup', 
	touchCancelEvent : 'mouseleave',

	init: function() {
		this.isTouch           = Boolean( document.ontouchstart !== undefined );
		this.touchClickEvent   = this.isTouch ? 'touchstart' : 'click';
		this.touchStartEvent   = this.isTouch ? 'touchstart' : 'mousedown';
		this.touchMoveEvent    = this.isTouch ? 'touchmove' : 'mousemove';
		this.touchEndEvent     = this.isTouch ? 'touchend' : 'mouseup';
		this.touchCancelEvent  = this.isTouch ? 'touchcancel' : 'mouseleave';
	}, 

	getPlatform: function() {
		var OS = "Mac"; 
		if ( navigator.appVersion.indexOf("Win") !== -1 ) OS = "Win"; 
		return OS;
	}, 

	isiOS: function() {
		var iOS = false;
		if ( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
			iOS = true;
		}
		return iOS;
	}

};

module.exports = Utils;