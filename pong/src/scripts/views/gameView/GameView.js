/**
 * @type {Class}
 */
var BaseView        = require('../../supers/BaseView');
var template        = require('./GameViewTemplate.hbs'); 
var Utils           = require('../../utils/Utils');
var AppConfig       = require('../../config/AppConfig');
var AppEvent        = require('../../events/AppEvents');

var GameView = BaseView.extend({

	id                 : 'game-view', 
	template           : template,
	rAF                : null,

	boolUpKeydown      : false,
	boolDownKeydown    : false,
	boolIsPlaying      : false,
	boolIsCounting     : false,

	test : 0,

	numTweenSpeed      : 0,

	numTouchStartY     : null,
	numTouchY          : null,
	numPrevY           : null,

	numPlayerHeight    : 80,
	numPlayerWidth     : 15,

	countdown : {
		$el    : null,
		timer  : null,
		start  : 3,
		speed  : 500,
		msg    : 'Go!',
		pause  : 'Pause'
	},

	player1 : {
		$el    : null,
		x      : null,
		y      : null
	},

	player2 : {
		$el    : null,
		x      : null,
		y      : null
	},

	ball : {
		$el    : null,
		size   : 20,
		dirX : 3,
		dirY : 3,
		x      : null,
		y      : null
	},

	scores : {
		$el1   : null,
		$el2   : null,
		p1     : 0,
		p2     : 0,
		max    : 10
	},

	speed : {
		friction  : 0.95,
		cur       : 0,
		inc       : 1,
		max       : 10
	},



	/**
	 * Initialize the view
	 */
	initialize: function( options ) {
		this._super();
	},

	uninit: function() {
		this._removeListeners();
		this._super();
	}, 

	/**
	 * Render HTML
	 * Add event listeners
	 * Set element vars
	 */
	render: function() {
		this._super();

		this.$el.html( this.template() );

		this._addListeners();

		if ( Utils.isiOS() ) {
			window.location = 'iad:hide';
		}

		this.countdown.$el  = this.$el.find('#countdown');
		this.player1.$el    = this.$el.find('#player1');
		this.player2.$el    = this.$el.find('#player2');
		this.scores.$el1    = this.$el.find('#score1');
		this.scores.$el2    = this.$el.find('#score2');
		this.ball.$el       = this.$el.find('#ball');
		
		this._initGame();

		return this;
	}, 

	//*******************
	// METHODS
	//*******************
	
	/**
	 * Setup the game
	 * Reset position of elements
	 * Start the countdown
	 */
	_initGame: function() {

		// Reset player pos values
		this.player1.x = 10;
		this.player1.y = (AppConfig.stageHeight / 2) - 40;
		this.player2.x = AppConfig.stageWidth - this.numPlayerWidth - this.player1.x;
		this.player2.y = (AppConfig.stageHeight / 2) - 40;

		// Reset ball pos values
		this.ball.x    = (AppConfig.stageWidth / 2) - 10;
		this.ball.y    = (AppConfig.stageHeight / 2) - 10;

		var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
		var plusOrMinusY = Math.random() < 0.5 ? -1 : 1;

		this.ball.dirX *= plusOrMinusX;
		this.ball.dirY *= plusOrMinusY;

		// Display scores
		this.scores.$el1.html( this.scores.p1 );
		this.scores.$el2.html( this.scores.p2 );

		// Display players and ball
		this.player1.$el.css({
			height   : this.numPlayerHeight,
			left     : this.player1.x,
			top      : this.player1.y,
			width    : this.numPlayerWidth
		});

		this.player2.$el.css({
			height   : this.numPlayerHeight,
			left     : this.player2.x,
			top      : this.player1.y,
			width    : this.numPlayerWidth
		});

		this.ball.$el.css({
			height   : this.ball.size,
			left     : this.ball.x,
			opacity  : 0,
			top      : this.ball.y,
			width    : this.ball.size
		});

		this.countdown.timer = null;

		this._initCountdown();
	},

	/**
	 * Initialize the countdown clock
	 */
	_initCountdown: function() {
		this.boolIsCounting = true;
		this.countdown.$el.html( this.countdown.start );
		this.countdown.timer = setInterval( this._countdown, this.countdown.speed );
	},
	/**
	 * Animate the countdown then
	 * Start the game
	 */
	_countdown: function() {
		var curTime = parseInt( this.countdown.$el.html(), 10 ),
			self = this;

		if ( curTime === 1 ) {
			this.countdown.$el.html( this.countdown.msg );
			clearInterval( this.countdown.timer );
			setTimeout( function() {
				self.countdown.$el.html('');
				self.ball.$el.css({ opacity: 1 });
				self._startGame();
			}, self.countdown.speed );
		} else {
			curTime--;
			this.countdown.$el.html( curTime );
		}
	},

	/**
	 * Start the request animation frame and run the game
	 */
	_startGame: function() {
		this.boolIsPlaying = true;
		this.boolIsCounting = false;
		this.rAF = window.requestAnimationFrame( $.proxy(this._startGame, this) );
		this._playLoop();
	},

	/**
	 * Run the game 
	 */
	_playLoop: function() {
		this.test++;

		if ( this.test === 60 ) {
			this.test = 0;
		}

		this._animateBall();
		this._setPlayerPos( this.player1 );
		this._setPlayerPos( this.player2, true );
	},

	
	_togglePlayPause: function( $event ) {

		if ( !this.boolIsCounting ) {

			if ( this.boolIsPlaying ) {
				this.countdown.$el.html( this.countdown.pause );
				this.boolIsPlaying = false;
				window.cancelAnimationFrame( this.rAF );
			} else {
				this.countdown.$el.html('');
				this._startGame();
			} 
		}
	},

	/**
	 * Pause the game when a player scores then
	 * Start the countdown again or end the game
	 */
	_endRound: function() {
		var self = this;

		this.boolIsPlaying = false;
		window.cancelAnimationFrame( this.rAF );

		if ( this.scores.p1 !== this.scores.max && this.scores.p2 !== this.scores.max ) {
			setTimeout( function() {
				self._initGame();
			}, self.countdown.speed );
		} else {
			this._endGame();
		}
	},

	/**
	 * Navigate to the end screen
	 */
	_endGame: function() {
		this.boolIsPlaying = false;

		if ( this.scores.p1 > this.scores.p2 )  {
			this.model.winner = this.model.player1;
		} else {
			this.model.winner = this.model.player2;
		}
		this.scores.p1 = 0;
		this.scores.p2 = 0;
		window.location.hash = 'score';
	},

	/**
	 * Pause the game and update the scoreboard
	 */
	_updateScores: function() {
		this.scores.$el1.html( this.scores.p1 );
		this.scores.$el2.html( this.scores.p2 );

		this._endRound();
	},

	/**
	 * Animate the player positions
	 * @param {Object} objPlayer     player info
	 * @param {Bool} boolIsComputer  set to true if objPlayer is player2 (computer)
	 * @param {Number} numTouchDist  distance to move player based on touch events
	 */
	_setPlayerPos: function( objPlayer, boolIsComputer, numTouchDist ) {
		
		// Detect arrow up and move player up
		if ( this.boolUpKeydown ) {
			this.speed.cur -= this.speed.inc;
		}
		// Detect arrow down and move player down
		if ( this.boolDownKeydown ) {
			this.speed.cur += this.speed.inc;
		}
		/**
		 *
		 *
		 * this is not right. should have friction or something.
		 */
		if ( numTouchDist ) {

			objPlayer.y = numTouchDist - (this.numPlayerHeight / 2);

			/*if ( numTouchDist < 0 ) {
				this.speed.cur -= this.speed.inc;
			} else {
				this.speed.cur += this.speed.inc;
			}*/
		}

		// Add friction to player movement
		if ( this.speed.cur !== 0 ) {

			this.speed.cur *= this.speed.friction;
			
			if ( this.speed.cur > this.speed.max ) {
				this.speed.cur = this.speed.max;
			} else if ( this.speed.cur < -this.speed.max ) {
				this.speed.cur = -this.speed.max;	
			}
			
			if ( this.speed.cur < 0.1 && this.speed.cur > -0.1) {
				this.speed.cur = 0;
			}

			objPlayer.y += this.speed.cur;
		}

		// Mirror ball Y pos when it's moving toward player 2
		if ( boolIsComputer && this.ball.x > 0 ) {
			objPlayer.y = this.ball.y;
		}

		// Detect collision with top
		if ( objPlayer.y <= 0 ) {
			objPlayer.y = 0;
		}
		// Detect collision with bottom
		if ( objPlayer.y >= AppConfig.stageHeight - this.numPlayerHeight ) {
			objPlayer.y = AppConfig.stageHeight - this.numPlayerHeight;
		}

		// Always animate computer pos
		if ( boolIsComputer ) {
			this._animatePlayerPos( objPlayer );
		} else {
			// Animate player1 if ball is to the right, above or below
			if ( objPlayer.x + this.numPlayerWidth <= this.ball.x || 
				objPlayer.y + this.numPlayerHeight <= this.ball.y || 
				objPlayer.y >= this.ball.y + this.ball.size ) {
				this._animatePlayerPos( objPlayer );
			}
		}
	},

	_animatePlayerPos: function( objPlayer ) {
		// Animate position
		TweenMax.to( objPlayer.$el, this.numTweenSpeed, {
			top: objPlayer.y
		});
	},

	/**
	 * Animate the position of the ball
	 */
	_animateBall: function() {

		// Detect collision with left edge
		if ( this.ball.x <= 0 ) {
			this.scores.p2++;
			this._updateScores();
		}

		// Detect collison with right edge
		if ( this.ball.x >= AppConfig.stageWidth - this.ball.size ) {
			this.scores.p1++;
			this._updateScores();
		}
		
		/**
		 * Detect collision with player1
		 */
		// Use vars that are easier to read
		var ballLeft     = this.ball.x,
			ballRight    = this.ball.x + this.ball.size,
			ballTop      = this.ball.y,
			ballBottom   = this.ball.y + this.ball.size,
			playerLeft   = this.player1.x,
			playerRight  = this.player1.x + this.numPlayerWidth,
			playerTop    = this.player1.y,
			playerBottom = this.player1.y + this.numPlayerHeight;

		// If ball is at the right edge of player
		if ( ballLeft >= playerRight && ballLeft <= playerRight + Math.abs( this.ball.dirX ) ) {

			// If ball is within player height, reverse horizontal direction
			if ( ballTop >= playerTop - this.ball.size && ballBottom <= playerBottom + this.ball.size  ) {
				this.ball.dirX = -this.ball.dirX;
			}

		}
		// If ball has crossed right edge of player
		else if ( ballLeft < playerRight ) {

			// If ball is colliding with top of player
			if ( ballBottom >= playerTop && ballBottom <= playerTop + this.ball.size ) {

				// Reverse vertical direction if ball is going down
				if ( this.ball.dirY > 0 ) {
					this.ball.dirY = -this.ball.dirY;
				}
			}
			// If ball is colliding with bottom of player
			if ( ballTop <= playerBottom && ballTop >= playerBottom - this.ball.size ) {

				// Reverse vertical direction if ball is going up
				if ( this.ball.dirY < 0 ) {
					this.ball.dirY = -this.ball.dirY;
				}
			}
		}


		// Detect collision with player2
		if ( this.ball.x >= this.player2.x - this.ball.size ) {
			if ( this.ball.y >= this.player2.y && this.ball.y <= this.player2.y + this.numPlayerHeight ) {
				this.ball.dirX = -this.ball.dirX;
			}
		}
		
		// Detect collision with top/bottom
		if ( this.ball.y <= 0 || this.ball.y >= AppConfig.stageHeight - this.ball.size ) {
			this.ball.dirY = -this.ball.dirY;
		}

		this.ball.x += this.ball.dirX;
		this.ball.y += this.ball.dirY;

		// Animate the position
		TweenMax.to( this.ball.$el, this.numTweenSpeed, {
			left: this.ball.x,
			top: this.ball.y
		});
	},

	/**
	 * Detect touchstart event
	 */
	_onTouchStart: function( $event ) {
		var touchEvent = $event.originalEvent || $event;

		this.numTouchStartY = touchEvent.touches[0].pageY;

		//this.speed.cur = 0;

		this.$el.on( 'touchmove', this._onTouchMove );
		this.$el.on( 'touchend', this._onTouchEnd );
	},

	/**
	 * Detect touchmove event
	 *
	 *
	 * touch is all wrong.
	 */
	_onTouchMove: function( $event ) {
		var touchEvent = $event.originalEvent || $event;

		var curY = touchEvent.touches[0].pageY,
			difY = curY - this.numTouchStartY;

		/*console.log('this.numTouchStartY '+this.numTouchStartY);
		console.log('curY '+curY);
		console.log('difY '+difY);
		console.log('this.numPrevY '+this.numPrevY);
		console.log('---------------');

		if ( !this.numPrevY ) {
			this._setPlayerPos( this.player1, false, difY );
		} else {
			var difY = y - this.numPrevY;
			this._setPlayerPos( this.player1, false, difY );
		}
	

		this.numPrevY = y;*/

		this._setPlayerPos( this.player1, false, curY );
	},

	_onTouchEnd: function( $event ) {
		
		this.$el.off( 'touchmove' );
		this.$el.off( 'touchend' );
	},


	/**
	 * Detect keydown event on up/down arrows
	 * @param  {Number} $keyCode  character code
	 */
	_onKeyDown: function( $keyCode ){
		// Up arrow
		if ( $keyCode === 38 ) {
			this.boolUpKeydown = true;
		}
		// Down arrow
		if ( $keyCode === 40 ) {
			this.boolDownKeydown = true;
		}
	},
	/**
	 * Detect keyup event on up/down arrows
	 * @param  {Number} $keyCode  character code
	 */
	_onKeyUp: function( $keyCode ){
		// Up arrow
		if ( $keyCode === 38 ) {
			this.boolUpKeydown = false;
		}
		// Down arrow
		if ( $keyCode === 40 ) {
			this.boolDownKeydown = false;
		}
		// Spacebar
		if ( $keyCode === 32 ) {
			this._togglePlayPause();
		}
	},

	//*******************
	// EVENTS
	//*******************
	_addListeners: function() {
		var self = this;

		$(document).on( 'touchstart', this._onTouchStart );

		$(document).on( 'keydown', function( event ) {
			self._onKeyDown( event.keyCode );
		});	
		$(document).on( 'keyup', function( event ) {
			self._onKeyUp( event.keyCode );
		});
	}, 

	_removeListeners: function() {
		$(document).off( 'touchstart' );
		$(document).off( 'keydown' );
		$(document).off( 'keyup' );
	}


});
module.exports = GameView;