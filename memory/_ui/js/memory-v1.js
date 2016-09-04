// add end game, winner, etc.


/**
 *	Memory Game
 *
 *	@description
 *		- 
 *
 *	@author ZE
 *	@version 1.0
 *	@requires
 *		- jQuery 1.8.3 min
 *		- TweenMax 1.8.0
 */

window.Memory = function ($wrapper, $options) {

	this.options = $.extend({
		numPlayers: 3,          // number of players
		numMatches: 16          // number of tile matches
	}, $options);

	this.init($wrapper);
}


window.Memory.prototype = {

	init: function($wrapper){
		var self = this;
		
		// global vars
		this.elGame          = $($wrapper);

		this.elScoreboard    = $('<div class="scoreboard" />');
		this.elPlayerList    = $('<ul class="players" />');
		this.elPlayers;

		this.elTileList      = $('<ul class="tiles" />');
		this.elTiles;

		this.arrayTiles      = [];

		this.numCurPlayer    = 0;
		this.numFlips        = 0;
		this.strFlip1        = '';
		this.strFlip2        = '';

		this.ACTIVE_CLASS    = 'active';
		this.FLIP_UP_CLASS   = 'flip-up';
		this.FLIP_DOWN_CLASS = 'flip-down';

		this.createPlayers();
		this.createData();
	},

	createData: function() {

		// initially create data array
		for(i=0; i<this.options.numMatches; i++) {
			this.arrayTiles.push(i);
			this.arrayTiles.push(i);
		}

		// randomize the array
		for (i=0, len=this.arrayTiles.length; i<len; i++) {

			var randomIndex = Math.floor(Math.random() * i),
				tempValue = this.arrayTiles[i];

			this.arrayTiles[i] = this.arrayTiles[randomIndex];
			this.arrayTiles[randomIndex] = tempValue;
		}

		this.createTiles();
	},

	createTiles: function() {

		this.elGame.append(this.elTileList);

		for(i=0, len=this.arrayTiles.length; i<len; i++) {

			this.elTileList.append('<li><div class="back"></div><div class="front">' + this.arrayTiles[i] + '</div></li>');

		}

		this.elTiles = this.elTileList.find('li');

		this.bindEvents();
	},

	createPlayers: function() {

		this.elGame.append(this.elScoreboard);
		this.elScoreboard.append('<h1>Scoreboard</h1>');
		this.elScoreboard.append(this.elPlayerList);

		for(i=1; i<=this.options.numPlayers; i++) {
			this.elPlayerList.append('<li>Player ' + i + ': <span>0</span></li>');
		}

		this.elPlayers = $('ul.players li');

		this.setActivePlayer(0);

	},

	setActivePlayer: function( playerIndex ) {
		var curPlayer = $(this.elPlayers[playerIndex]);

		this.elPlayers.removeClass('active');
		curPlayer.addClass('active');

	},


	selectTile: function(e) {

		if(this.numFlips < 2) {

			if( !$(e.currentTarget).hasClass('matched') ) {

				$(e.currentTarget).addClass(this.FLIP_UP_CLASS);

				if(this.numFlips == 0) {
					this.strFlip1 = e.currentTarget.innerText;
				} else {
					this.strFlip2 = e.currentTarget.innerText;
					this.compareTiles(this.strFlip1, this.strFlip2);
				}

				this.numFlips++;
			}
		}
		
	},

	compareTiles: function(tile1, tile2) {
		var self = this;

		if(tile1 == tile2) {
			setTimeout(function(){
				self.success();
			}, 1000);
		} else {
			setTimeout(function(){
				self.fail();
			}, 1000);
			
		}

	},

	fail: function() {

		var self = this;

		this.elTiles.each(function(){

			if( $(this).hasClass(self.FLIP_UP_CLASS) ) {
				var curTile = $(this);

				curTile.removeClass(self.FLIP_UP_CLASS).addClass(self.FLIP_DOWN_CLASS);

				setTimeout(function(){
					curTile.removeClass(self.FLIP_DOWN_CLASS);
				}, 1000);

			}
		});

		this.endTurn();

	},
	success: function() {

		var self = this;

		this.elTiles.each(function(){

			if( $(this).hasClass(self.FLIP_UP_CLASS) ) {
				var curTile = $(this);

				curTile.removeClass(self.FLIP_UP_CLASS).addClass('matched');

			}
		});

		var player = $(this.elPlayers[this.numCurPlayer]),
			elScore = player.find('span'),
			score = parseInt(elScore.text());

			score++;

		elScore.text(score);

		this.numFlips = 0;
	},

	endTurn: function() {

		this.numFlips = 0;

		this.numCurPlayer++;

		if(this.numCurPlayer >= this.options.numPlayers) {
			this.numCurPlayer = 0;
		}

		this.setActivePlayer(this.numCurPlayer);

	},

	bindEvents: function(){
		var self = this;

		// bind click events
		this.elTiles.bind('click', function(e){
			self.selectTile(e);
		});

	}
}