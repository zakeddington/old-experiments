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

	// Key input bools
	boolLeftKeydown    : false,
	boolUpKeydown      : false,
	boolRightKeydown   : false,
	boolDownKeydown    : false,
	boolIsPlaying      : false,
	boolIsCounting     : false,

	// Touch inputs
	numTouchStartY     : null,
	numTouchY          : null,
	numPrevX           : null,
	numPrevY           : null,
	numMaxDist         : 15,

	numTweenSpeed      : 0,

	numPlayerRadius    : 15,

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
		y      : null,
		dirX   : 0,
		dirY   : 0
	},
	player2 : {
		$el    : null,
		x      : null,
		y      : null,
		dirX   : 0,
		dirY   : 0
	},
	speed : {
		friction  : 0.95,
		inc       : 1,
		max       : 5
	},

	puck : {
		$el    : null,
		radius : 10,
		dirX   : null,
		dirY   : null,
		x      : null,
		y      : null
	},

	bumpers : {
		height  : 10,
		width   : 100,
		x1      : 0,
		x2      : AppConfig.stageWidth - 100,
		y1      : 0,
		y2      : AppConfig.stageHeight - 10
	},

	scores : {
		$el1   : null,
		$el2   : null,
		p1     : 0,
		p2     : 0,
		max    : 10
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

		this.$el.html( this.template( this.model ) );

		this._addListeners();

		if ( Utils.isiOS() ) {
			window.location = 'iad:hide';
		}

		this.countdown.$el  = this.$el.find('#countdown');
		this.player1.$el    = this.$el.find('#player1');
		this.player2.$el    = this.$el.find('#player2');
		this.scores.$el1    = this.$el.find('#score1');
		this.scores.$el2    = this.$el.find('#score2');
		this.puck.$el       = this.$el.find('#puck');
		
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
		this.player1.x = (AppConfig.stageWidth / 2) - this.numPlayerRadius;
		this.player1.y = AppConfig.stageHeight - this.numPlayerRadius * 4;
		this.player1.dirX = 0;
		this.player1.dirY = 0;
		this.player2.x = (AppConfig.stageWidth / 2) - this.numPlayerRadius;
		this.player2.y = this.numPlayerRadius * 4;
		this.player2.dirX = 0;
		this.player2.dirY = 0;

		// Reset puck pos values
		this.puck.x    = (AppConfig.stageWidth / 2) - this.puck.radius;
		this.puck.y    = (AppConfig.stageHeight / 2) - this.puck.radius;
		// Set random direction
		this.puck.dirX = Math.floor( Math.random() * 3 ) + 1;
		this.puck.dirY = Math.floor( Math.random() * 3 ) + 1;
		this.puck.dirX *= Math.floor( Math.random() * 2 ) === 1 ? 1 : -1;
		this.puck.dirY *= Math.floor( Math.random() * 2 ) === 1 ? 1 : -1;

		// Display scores
		this.scores.$el1.html( this.scores.p1 );
		this.scores.$el2.html( this.scores.p2 );

		// Display players and puck
		this.player1.$el.css({
			height   : this.numPlayerRadius * 2,
			left     : this.player1.x,
			top      : this.player1.y,
			width    : this.numPlayerRadius * 2
		});

		this.player2.$el.css({
			height   : this.numPlayerRadius * 2,
			left     : this.player2.x,
			top      : this.player2.y,
			width    : this.numPlayerRadius * 2
		});

		this.puck.$el.css({
			height   : this.puck.radius * 2,
			left     : this.puck.x,
			opacity  : 0,
			top      : this.puck.y,
			width    : this.puck.radius * 2
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
				self.puck.$el.css({ opacity: 1 });
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

		this._setPuckPos();
		this._setPlayerPos( this.player1 );
		this._setPlayerPos( this.player2, true );
	},

	/**
	 * Play and Pause the game on spacebar
	 */
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
	 * Set the player positions based on touch/key inputs and collisions with edges
	 * @param {Object} objPlayer       player info
	 * @param {Bool}   boolIsComputer  set to true if objPlayer is player2 (computer)
	 * @param {Object} touchPos        distance to move player based on touch events
	 */
	_setPlayerPos: function( objPlayer, boolIsComputer, touchPos ) {
		
		// Detect arrow up
		if ( this.boolUpKeydown ) {
			objPlayer.dirY -= this.speed.inc;
		}
		// Detect arrow down
		if ( this.boolDownKeydown ) {
			objPlayer.dirY += this.speed.inc;
		}
		
		// Detect arrow left
		if ( this.boolLeftKeydown ) {
			objPlayer.dirX -= this.speed.inc;
		}
		// Detect arrow right
		if ( this.boolRightKeydown ) {
			objPlayer.dirX += this.speed.inc;
		}



		// Mirror puck X pos when it's moving toward player 2
		if ( boolIsComputer && this.puck.y < AppConfig.stageHeight / 2 ) {

			//objPlayer.x = (this.puck.x - objPlayer.x)* this.speed.friction;
			objPlayer.dirX += (this.puck.dirX - objPlayer.dirX) * this.speed.friction;
			objPlayer.dirY = -(this.puck.dirY * this.speed.friction);

			this._addFriction( objPlayer, 'x' );
			this._addFriction( objPlayer, 'y' );
		}


		
		// Add friction and detect Y collisions for player 1
		if ( !boolIsComputer ) {

			// No friction to player on touch movement
			if ( touchPos ) {
				objPlayer.y = touchPos.y - this.numPlayerRadius;
				objPlayer.x = touchPos.x - this.numPlayerRadius;
				objPlayer.dirY = touchPos.dirY;
				objPlayer.dirX = touchPos.dirX;
			} else {
				// Add friction to player on arrow movement 
				if ( objPlayer.dirY !== 0 ) {
					this._addFriction( objPlayer, 'y' );
				}
				if ( objPlayer.dirX !== 0 ) {
					this._addFriction( objPlayer, 'x' );
				}
			}

			// Detect Y collisions
			if ( objPlayer.y <= (AppConfig.stageHeight / 2) ) {
				objPlayer.y = (AppConfig.stageHeight / 2);
			}
			if ( objPlayer.y >= AppConfig.stageHeight - this.bumpers.height - (this.numPlayerRadius * 2) ) {
				objPlayer.y = AppConfig.stageHeight - this.bumpers.height - (this.numPlayerRadius * 2);
			}

		} 
		// Detect Y collisions for computer
		else if ( boolIsComputer ) {

			if ( objPlayer.y <= this.bumpers.height ) {
				objPlayer.y = this.bumpers.height;
			}
			if ( objPlayer.y >= AppConfig.stageHeight / 2 - (this.numPlayerRadius * 2) ) {
				objPlayer.y = AppConfig.stageHeight / 2 - (this.numPlayerRadius * 2);
			}
				
		}

		// Detect X collisions for both players
		if ( objPlayer.x <= 0 ) {
			objPlayer.x = 0;
		}
		if ( objPlayer.x >= AppConfig.stageWidth - (this.numPlayerRadius * 2) ) {
			objPlayer.x = AppConfig.stageWidth - (this.numPlayerRadius * 2);
		}


		this._animatePosition( objPlayer );
	},

	/**
	 * Add friction to player movement
	 * @param {Object} objPlayerPos player object
	 * @param {String} XorY         value to update
	 */
	_addFriction: function( objPlayer, XorY ) {

		var dir;

		if ( XorY === 'x' ) {
			dir = 'dirX';
		} else {
			dir = 'dirY';
		}

		objPlayer[dir] *= this.speed.friction;
		
		if ( objPlayer[dir] > this.speed.max ) {
			objPlayer[dir] = this.speed.max;
		} else if ( objPlayer[dir] < -this.speed.max ) {
			objPlayer[dir] = -this.speed.max;	
		}
		
		if ( objPlayer[dir] < 0.1 && objPlayer[dir] > -0.1) {
			objPlayer[dir] = 0;
		}

		objPlayer[XorY] += objPlayer[dir];

	},

	/**
	 * Animate position of players and puck
	 * @param  {Object} objElement Object to animate
	 */
	_animatePosition: function( objElement ) {
		// Animate position
		TweenMax.to( objElement.$el, this.numTweenSpeed, {
			left: objElement.x,
			top: objElement.y
		});
	},

	/**
	 * Set the position of the puck
	 * Detect collisions with edges and players
	 */
	_setPuckPos: function() {
		
		// Set player reference based on whose side it's on
		var player, boolIsPlayer = true;

		if ( this.puck.y >= AppConfig.stageHeight / 2 - this.puck.radius ) {
			player = this.player1;
		} else {
			player = this.player2;
			boolIsPlayer = false;
		}

		// Use vars that are easier to read
		var puckLeft       = this.puck.x,
			puckRight      = this.puck.x + (this.puck.radius * 2),
			puckTop        = this.puck.y,
			puckBottom     = this.puck.y + (this.puck.radius * 2),

			goalLeft   = this.bumpers.width,
			goalRight  = this.bumpers.x2,
			topGoal    = this.bumpers.height,
			botGoal    = this.bumpers.y2;

		// Detect collision with players
		this._detectPlayerPuckCollision( player, boolIsPlayer );


		// Detect collision with bumpers
		if ( puckLeft <= goalLeft || puckRight >= goalRight ) {
			
			// Get distance puck crosses bumper edges
			var difLeft   = goalLeft - this.puck.x,
				difRight  = this.puck.x + (this.puck.radius * 2) - goalRight,
				difTop    = topGoal - this.puck.y,
				difBottom = this.puck.y + (this.puck.radius * 2) - botGoal;

			// Set y position for top/bottom
			var yPos;

			if ( puckTop <= topGoal ) {
				yPos = topGoal;
			} else if ( puckBottom >= botGoal ) {
				yPos = botGoal - (this.puck.radius * 2);
			}

			// Check if puck breaks the y plane of the bumpers
			if ( puckTop <= topGoal || puckBottom >= botGoal) {
				// If it is closer to the top/bottom than it is to the sides of the goal
				// reverse it's y direction
				if ( difLeft > difTop && difLeft > 0 || difRight > difTop && difRight > 0 ) {
					this.puck.y = yPos;
					this.puck.dirY = -this.puck.dirY;
				} 
				// Otherwise, reverse the x direction (it's a goal!)
				else {
					this.puck.dirX = -this.puck.dirX;
				}
			}
		}


		// Count the goal
		if ( puckBottom < 0 ) {
			this.scores.p1++;
			this._updateScores();
		}
		if ( puckTop > AppConfig.stageHeight ) {
			this.scores.p2++;
			this._updateScores();
		}


		// Detect collision with left
		if ( puckLeft <= 0 ) {
			this.puck.x = 0;
			this.puck.dirX = -this.puck.dirX;
		}
		// Detect collision with right
		if ( puckRight >= AppConfig.stageWidth ) {
			this.puck.x = AppConfig.stageWidth - (this.puck.radius * 2);
			this.puck.dirX = -this.puck.dirX;
		}


		// Update X and Y values for the puck position
		this.puck.x += this.puck.dirX;
		this.puck.y += this.puck.dirY;


		// Animate the position
		this._animatePosition( this.puck );
	},

	_detectPlayerPuckCollision: function ( objPlayer, boolIsPlayer ) {

		var	player         = objPlayer, 
			puckCenterX    = this.puck.x + this.puck.radius,
			puckCenterY    = this.puck.y + this.puck.radius,

			playerCenterX  = player.x + this.numPlayerRadius,
			playerCenterY  = player.y + this.numPlayerRadius;


		// Get the distance between puck and player
		var dx = (puckCenterX - playerCenterX);
		var dy = (puckCenterY - playerCenterY);

		//get the distance between the two
		var hypot = Math.sqrt( (dx * dx) + (dy * dy) );

		// Detect collision with player
		if ( (this.numPlayerRadius + this.puck.radius) > hypot ) {

			// Get the collision angle
			var angle = Math.atan2(dy,dx);
			// Get our cosine/sine
			var cosa = Math.cos(angle);
			var sina = Math.sin(angle);

			// Rotate vectors to get collision in 1 dimension
			var vx2 = cosa * this.puck.dirX + sina * this.puck.dirY;
			var vy1 = cosa * this.puck.dirY - sina * this.puck.dirX;
			
			var vx1 = cosa * player.dirX + sina * player.dirY;
			var vy2 = cosa * player.dirY - sina * player.dirX;

			// Set puck direction
			this.puck.dirX = cosa * vx1 - sina * vy1;
			this.puck.dirY = cosa * vy1 + sina * vx1;

			// Set paddle direction
			player.dirX = cosa * vx2 - sina * vy2;
			player.dirY = cosa * vy2 + sina * vx2;

			// Move puck to the edge of the collision
			this.puck.x = player.x + cosa * ( this.numPlayerRadius + this.puck.radius );
			this.puck.y = player.y + sina * ( this.numPlayerRadius + this.puck.radius );

			// Add friction to paddle
			this._addFriction( player, 'x' );
			this._addFriction( player, 'y' );

			if ( boolIsPlayer ) {
				// Kill touch events
				this.$el.off( 'touchmove' );
				this.$el.off( 'touchend' );
			
			
			}
		}
	},

	/**
	 * Detect touchstart event
	 */
	_onTouchStart: function( $event ) {
		var touchEvent = $event.originalEvent || $event;

		this.numTouchStartX = touchEvent.touches[0].pageX;
		this.numTouchStartY = touchEvent.touches[0].pageY;

		this.prevX = this.numTouchStartX;
		this.prevY = this.numTouchStartY;

		//this.speed.cur = 0;

		this.$el.on( 'touchmove', this._onTouchMove );
		this.$el.on( 'touchend', this._onTouchEnd );
	},

	/**
	 * Detect touchmove event
	 */
	_onTouchMove: function( $event ) {
		var touchEvent = $event.originalEvent || $event;


		var pos = {
				x: touchEvent.touches[0].pageX,
				y: touchEvent.touches[0].pageY
			};

		pos.dirX = pos.x - this.prevX;
		pos.dirY = pos.y - this.prevY;

		if ( pos.dirX > this.numMaxDist ) {
			pos.x = this.prevX + this.numMaxDist;
			pos.dirX = this.numMaxDist;
		}
		if ( pos.dirX < -this.numMaxDist ) {
			pos.x = this.prevX + -this.numMaxDist;
			pos.dirX = -this.numMaxDist;
		}
		if ( pos.dirY > this.numMaxDist ) {
			pos.y = this.prevY + this.numMaxDist;
			pos.dirY = this.numMaxDist;
		}
		if ( pos.dirY < -this.numMaxDist ) {
			pos.y = this.prevY + -this.numMaxDist;
			pos.dirY = -this.numMaxDist;
		}

		this.prevX = pos.x;
		this.prevY = pos.y;

		this._setPlayerPos( this.player1, false, pos );
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
		// Left arrow
		if ( $keyCode === 37 ) {
			this.boolLeftKeydown = true;
		}
		// Up arrow
		if ( $keyCode === 38 ) {
			this.boolUpKeydown = true;
		}
		// Right arrow
		if ( $keyCode === 39 ) {
			this.boolRightKeydown = true;
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
		// Left arrow
		if ( $keyCode === 37 ) {
			this.boolLeftKeydown = false;
		}
		// Up arrow
		if ( $keyCode === 38 ) {
			this.boolUpKeydown = false;
		}
		// Right arrow
		if ( $keyCode === 39 ) {
			this.boolRightKeydown = false;
		}
		// Down arrow
		if ( $keyCode === 40 ) {
			this.boolDownKeydown = false;
		}
		// Spacebar
		if ( $keyCode === 32 ) {
			this._togglePlayPause();
		}
		// r
		if ( $keyCode === 82 ) {
			this._endRound();
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