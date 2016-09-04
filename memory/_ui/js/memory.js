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
		//numPlayers: 3,          // number of players
		//numTiles: 16          // number of tile matches
	}, $options);

	this.init($wrapper);
}


window.Memory.prototype = {

	init: function($wrapper){
		var self = this;
		
		// global vars
		this.elGame          = $($wrapper);

		this.elIntro         = this.elGame.find('.intro');
		this.elNames         = this.elGame.find('ul.names');
		this.elBtnAdd        = this.elGame.find('button.add');
		this.elBtnRemove     = $('button.remove');
		this.elBtnReset      = $('button.reset');
		this.elRange         = $('ul.range li');
		this.elSlider        = $('input[type=range]');
		this.elTooltip       = $('span.range');

		this.strInputName    = '<input required type="text" placeholder="Enter Player Name" />';
		this.strBtnRemove    = '<button class="remove">-</button>';
		this.strBtnReset     = '<button class="reset">New Game</button>';

		this.numTiles        = 32;
		this.numMatches      = this.numTiles / 2;

		this.numPlayers      = 1;
		this.numCurPlayer    = 0;
		this.numFlips        = 0;
		this.strFlip1        = '';
		this.strFlip2        = '';
		this.speed           = 1;

		this.classActive     = 'active';
		this.classFlipUp     = 'flip-up';
		this.classFlipDown   = 'flip-down';

		this.elNames.find('li').append($(this.strInputName));
		this.setupGame();
		this.bindEvents();
	},

	setupGame: function() {
		var self = this;

		this.elScoreboard    = $('<div class="scoreboard" />');
		this.elPlayerList    = $('<ul class="players" />');
		this.elPlayers;

		this.elTileList      = $('<ul class="tiles" />');
		this.elTiles;

		this.arrayTiles      = [];
		this.numMatchesFound = 0;

		this.elScoreboard.css({ opacity: 0 });
		this.elTileList.css({ opacity: 0 });

		$(this.elRange[0]).text(this.elSlider.attr('min'));
		$(this.elRange[2]).text(this.elSlider.attr('max'));
		this.elTooltip.text(this.elSlider.val());

		TweenMax.to( this.elIntro, this.speed, {
			opacity: 1,
			top: '50px',
			onStart: function(){
				self.elIntro.show();
			},
			ease: Elastic.easeInOut
		});

	},

	setGameSize: function(e) {
		e.preventDefault();

		var min = this.elSlider.attr('min'),
			max = this.elSlider.attr('max'),
			cur = this.elSlider.val(),
			left;

		this.elTooltip.text(this.elSlider.val());

		left = (cur - min) / (max - min) * 98;

		TweenMax.to( this.elTooltip, 0.1, {
			left: left + '%'
		});

		this.numTiles = cur;
		this.numMatches = cur / 2;

	},

	addPlayer: function(e) {
		e.preventDefault();

		var newName = $('<li>' + this.strInputName + this.strBtnRemove + '</li>');

		newName.css({ opacity: 0 });

		this.elNames.append(newName);
		
		TweenMax.to( newName, this.speed, {
			opacity: 1,
			ease: Sine.easeInOut
		});

	},

	removePlayer: function(e) {
		e.preventDefault();

		var name = $(e.currentTarget).parent();

		TweenMax.to( name, this.speed / 4, {
			height: 0,
			opacity: 0,
			ease: Sine.easeInOut,
			onComplete: function() {
				name.remove();
			}
		});


	},

	hideSetup: function() {
		var self = this;

		TweenMax.to( this.elIntro, this.speed / 4, {
			opacity: 0,
			top: 0,
			ease: Sine.easeInOut,
			onComplete: function(){
				self.elIntro.hide();
			}
		});

	},


	createData: function() {

		// initially create data array
		for(i=0; i<this.numMatches; i++) {
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
		var self = this;

		this.elGame.append(this.elTileList);

		for(i=0, len=this.arrayTiles.length; i<len; i++) {

			var num = this.arrayTiles[i] + 21,
				str = '&#x' + num.toString() + ';',
				li = $('<li />'),
				back = $('<div class="back" />'),
				front = $('<div class="front" />');

			front.html(str);
			this.elTileList.append(li);
			li.append(back,front);
		}

		this.elTiles = this.elTileList.find('li');

		// bind click events
		this.elTiles.bind('click', function(e){
			self.selectTile(e);
		});

	},

	createPlayers: function(e) {

		var names = $(e.currentTarget).parent().find('input[type=text]');
		this.numPlayers = names.length;


		this.elGame.append(this.elScoreboard);
		this.elScoreboard.append('<h2>Scoreboard</h2>');
		this.elScoreboard.append(this.elPlayerList);

		for(i=0; i<this.numPlayers; i++) {

			this.elPlayerList.append('<li>' + names[i].value + ': <span>0</span></li>');
		}

		this.elPlayers = $('ul.players li');

		this.setActivePlayer(0);



		TweenMax.to( [this.elTileList, this.elScoreboard], this.speed, {
			opacity: 1,
			ease: Sine.easeInOut
		});

	},

	setActivePlayer: function( playerIndex ) {
		var curPlayer = $(this.elPlayers[playerIndex]);

		this.elPlayers.removeClass(this.classActive);
		curPlayer.addClass(this.classActive);

	},


	selectTile: function(e) {

		if(this.numFlips < 2) {

			if( !$(e.currentTarget).hasClass('matched') ) {

				$(e.currentTarget).addClass(this.classFlipUp);

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

			if( $(this).hasClass(self.classFlipUp) ) {
				var curTile = $(this);

				curTile.removeClass(self.classFlipUp).addClass(self.classFlipDown);

				setTimeout(function(){
					curTile.removeClass(self.classFlipDown);
				}, 1000);

			}
		});

		this.endTurn();

	},
	success: function() {

		var self = this;

		this.elTiles.each(function(){

			if( $(this).hasClass(self.classFlipUp) ) {
				var curTile = $(this);

				curTile.removeClass(self.classFlipUp).addClass('matched');

			}
		});

		var player = $(this.elPlayers[this.numCurPlayer]),
			elScore = player.find('span'),
			score = parseInt(elScore.text());

			score++;

		elScore.text(score);

		this.numFlips = 0;
		this.numMatchesFound++;

		if(this.numMatchesFound == this.numMatches) {
			this.endGame();
		}
	},

	endTurn: function() {

		this.numFlips = 0;

		this.numCurPlayer++;

		if(this.numCurPlayer >= this.numPlayers) {
			this.numCurPlayer = 0;
		}

		this.setActivePlayer(this.numCurPlayer);

	},

	endGame: function() {

		this.elTileList.remove();

		var scores = this.elPlayerList.find('span'),
			winnerScore = 0,
			winners = [];

		for(i=0; i<scores.length; i++) {
			var player = $(scores[i]).parent(),
				score = player.find('span').text();

			if(score > winnerScore) {
				winners = [player];
				winnerScore = score;
			} else if (score == winnerScore) {
				winners.push(player);
			}

		}

		for(i=0; i<winners.length; i++) {
			winners[i].addClass('winner').append('Winner!');
		}

		this.elScoreboard.append($(this.strBtnReset));

	},

	newGame: function(e) {
		e.preventDefault();

		this.elScoreboard.empty().remove();

		this.setupGame();

	},

	bindEvents: function(){
		var self = this;

		this.elBtnReset.live('click', $.proxy(this.newGame, this));
		this.elBtnRemove.live('click', $.proxy(this.removePlayer, this));

		this.elSlider.on('change', $.proxy(this.setGameSize, this)).trigger('change');

		this.elBtnAdd.on('click', $.proxy(this.addPlayer, this));

		this.elIntro.submit(function(e) {
			e.preventDefault();
			self.hideSetup();
			self.createPlayers(e);
			self.createData();
		});

	}
}