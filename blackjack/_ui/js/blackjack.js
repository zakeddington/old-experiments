
/* 
TODO:
	- convert drag and drop to html5 instead of jquery
*/

var Blackjack = function(){};

Blackjack.prototype = {
	
	init: function(){
		var base = this;

		// global variables
		this._boolGameStart = false;
		this._boolDropHit = false;
		this.playerCount = 0;
		// initial placeholder for player
		this._elEmptySeat = $(".empty-seat");
		// dealer
		this._elDealerPlaceholder = $("#dealer ul.placeholder");
		this._elDealerHand = $("#dealer ul.cards");
		this._elDealerScore = $("#dealer h2 span");
		this._handDealer = [];
		// results
		this.dealerScore = {};
		this.arrayScores = [];
		// buttons
		this._elPlayBtn = $("#play");
		// card html
		this._elCardMarkup = function(lastCard){
			return "<li class='" + lastCard.suitClass + "'><div class='card'><div class='front'><span class='num top'>" + lastCard.number + "</span><span class='suit'>" + lastCard.suitName + "</span><span class='num bottom'>" + lastCard.number + "</span></div><div class='back'></div></div></li>";
		};
		// deck
		this.arrayDeck = [];
		this._elNoCards = $("h2#no-cards");
		this._elDeckLI = $("div#deck ul li:last-child");
		/*
		// options for droppable elements (player hands)
		this._elDropOptions = {
	        drop: function(event, ui) {
				if(base._boolGameStart = true) {
					base._boolDropHit = true;
					$(this).find(".hit a").click();
					$(ui.draggable).remove();
				}
	        },
	        tolerance: "pointer",
	        hoverClass: "drop-hover",
	        accept: function() {
	        	// only accept draggable cards if game has started (true)
		        return base._boolGameStart;
		    }
		};*/
		// player chips
		this.playerChips = 100;
		this._elPlayerChips = $("#player-chips span");
		this.currentBet = 0;
		this._elCurrentBet = $("#current-bet span");
		this.splitBet = 0;
		this._elSplitBetTitle = $("#split-bet").hide();
		this._elSplitBet = $("#split-bet span");
		this._elBetButtons = $("#bets");
		this._elBet10 = $("#bet10");
		this._elBet20 = $("#bet20");
		this._elBet30 = $("#bet30");
		this._elBet40 = $("#bet40");
		this._elBet50 = $("#bet50");
		this._elBetAll = $("#all");

		$(this._elEmptySeat).show();

		this.initBet();
		
		// Play Button
		$(this._elPlayBtn).hide().click(function(){
			base.reset();
			return false;
		});

	    this.createDeck();
	},

	initBet: function(){
		var base = this;

		$(this._elPlayerChips).text(this.playerChips);

		$(this._elBet50).click(function(){
			base.placeBet(50);
			return false;
		});
		$(this._elBet40).click(function(){
			base.placeBet(40);
			return false;
		});
		$(this._elBet30).click(function(){
			base.placeBet(30);
			return false;
		});
		$(this._elBet20).click(function(){
			base.placeBet(20);
			return false;
		});
		$(this._elBet10).click(function(){
			base.placeBet(10);
			return false;
		});
		$(this._elBetAll).click(function(){
			base.placeBet(base.playerChips);
			return false;
		});
	},
	showBetButtons: function(){
		$(this._elBetButtons).removeClass("red").fadeIn();
		$("#bets a").fadeIn();
		this._boolGameStart = false;

		// Hide buttons if player doesn't have enough chips to bet
		if(this.playerChips < 50) {
			$(this._elBet50).hide();
		}
		if(this.playerChips < 40) {
			$(this._elBet40).hide();
		}
		if(this.playerChips < 30) {
			$(this._elBet30).hide();
		}
		if(this.playerChips < 20) {
			$(this._elBet20).hide();
		}
		if(this.playerChips < 10) {
			$(this._elBet10).hide();
		}
		if(this.playerChips <= 0) {
			$(this._elBetButtons).hide();
			this.showPlayButton();
		}
	},
	placeBet: function(value){

		this._boolGameStart = false;

		$(this._elBetButtons).fadeIn();
		$(this._elPlayerChips).text(this.playerChips);

		this.playerChips -= value;
		this.currentBet = value;
		$(this._elCurrentBet).text(value);

		$(this._elBetButtons).hide();
		this.play();
	},
	// Calculate winnings
	updateChips: function(chips, winLoseTie){
		if(winLoseTie == "tie"){
			this.playerChips += this.currentBet;
		} else if(winLoseTie == "win"){
			this.playerChips += (this.currentBet * 2);
		} else if(winLoseTie == "bj"){
			this.playerChips += (this.currentBet * 2.5);
		} else {
			// do nothing. chips already deducted from player		
		}
		$(this._elPlayerChips).text(this.playerChips);
		$(this._elCurrentBet).text("");
		$(this._elSplitBet).text("");
		$(this._elSplitBetTitle).hide();
	},

	createDeck: function(){
		var base = this;
		var card = {
			suitName: "",
			suitClass: "",
			number: "",
			value: ""
		};

		for(x=0; x<4; x++){
			if(x == 0){
				// spades
				for(y=1; y<14; y++){
					card.suitName = "\u2660";
					card.suitClass = "black";
					setNumValue(y);
					this.arrayDeck.push(card);
					card = {};
				}
			} else if(x == 2){
				// clubs
				for(y=1; y<14; y++){
					card.suitName = "\u2663";
					card.suitClass = "black";
					setNumValue(y);
					this.arrayDeck.push(card);
					card = {};
				}
			} else if(x == 3){
				// hearts
				for(y=1; y<14; y++){
					card.suitName = "\u2665";
					card.suitClass = "red";
					setNumValue(y);
					this.arrayDeck.push(card);
					card = {};
				}
			} else {
				// diamonds
				for(y=1; y<14; y++){
					card.suitName = "\u2666";
					card.suitClass = "red";
					setNumValue(y);
					this.arrayDeck.push(card);
					card = {};
				}
			}
		}

		function setNumValue(y){
			if(y == 1){
				card.number = "A";
			} else if(y == 11){
				card.number = "J";
			} else if(y == 12){
				card.number = "Q";
			} else if(y == 13){
				card.number = "K";
			} else {
				card.number = y;
			}
			// set the point value
			if(card.number == "J" || card.number == "Q" || card.number == "K"){
				card.value = 10;
			} else if(card.number == "A"){
				card.value = 11;
			} else {
				card.value = card.number;
			}
		}
		$("div#deck ul").empty();
		// create deck of cards
		for(i=0; i<this.arrayDeck.length; i++){
			$("div#deck ul").append("<li draggable='true'></li>");
		}


		//http://www.html5rocks.com/en/tutorials/dnd/basics/
		var dragCard = $("div#deck ul li");

		function handleDragStart(e) {
			console.log("start");
			this.style.opacity = '1';  // this / e.target is the source node.
		}
		function handleDragOver(e) {
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}
			e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
			return false;
		}
		function handleDragEnter(e) {
			// this / e.target is the current hover target.
			this.classList.add('over');
		}
		function handleDragLeave(e) {
			this.classList.remove('over');  // this / e.target is previous target element.
		}
		function handleDrop(e) {
			// this / e.target is current target element.
			if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
			}
			// See the section on the DataTransfer object.
			return false;
		}
		function handleDragEnd(e) {
			// this/e.target is the source node.
			[].forEach.call(cols, function (col) {
				col.classList.remove('over');
			});
		}

		[].forEach.call(dragCard, function(dragCard) {
			dragCard.addEventListener('dragstart', handleDragStart, false);
			dragCard.addEventListener('dragenter', handleDragEnter, false);
			dragCard.addEventListener('dragover', handleDragOver, false);
			dragCard.addEventListener('dragleave', handleDragLeave, false);
			dragCard.addEventListener('drop', handleDrop, false);
			dragCard.addEventListener('dragend', handleDragEnd, false);
		});



		/*
		// Drag and Drop from Deck 
		$("div#deck li").draggable({
			drag : function (event, ui) {
				$(this).addClass("drag");
				$(base._elBetButtons).removeClass("red");
			},
	        revert: function(valid) {
	        	if(valid) {
	        		// do nothing, drop card
	        	}
	        	else {
	        		// return card to deck and highlight betting title
	        		$(base._elBetButtons).addClass("red");
	        	}
	        	return !valid;
	        }
	    });
		*/
	},

	getCard: function() {
		var x = Math.floor(Math.random() * this.arrayDeck.length);

		if(this.arrayDeck.length == 0) {
			this.deckEmpty();
		} else {
			var card = this.arrayDeck.splice(x, 1);
			return card[0];
		}
	},
	// Deal a hand to the Dealer
	createDealerHand: function(){
		var base = this,
			target = this._elDealerHand,
			cards = this._handDealer;
			
		for(i=0; i<2; i++){
			cards.push(this.getCard());
		}
		
		$(this._elDealerPlaceholder).hide();
		for(i=0; i<cards.length; i++){
			$(target).append(this._elCardMarkup(cards[i])).hide().fadeIn(200);
			$("div#deck ul li:last-child").remove();
			setTimeout(function(){
				$(target).find("li:first-child").addClass("flip");
			}, 600);
		}
	},
	hitDealerHand: function(){
		var base = this,
			target = this._elDealerHand,
			cards = this._handDealer;

		$(this._elDealerHand).find("li:last-child").addClass("flip");
		// hit one card at a time until dealer has 17
		var value = this.getScore(cards);
		
		function hitDealer(value){
			if (value.score < 17) {
				// delay hit until hand is initially dealt/flipped
				setTimeout(function(){
					base.hit(cards, target, true);
					value = base.getScore(cards);
					// delay the check for another hit to give first hit a chance to flip
					setTimeout(function(){
						hitDealer(value);
						//$("div#deck ul li:last-child").remove();
					}, 600);
				}, 1200);
			} else {
				// dealer has at least 17 so end the game
				base.dealerScore = value;
				base.declareWinner();
			}

		}		
		hitDealer(value);
	},
	// Create a Player hand for initial deal and everytime they hit/split
	// splitCard = card to be used for creating the split hand
	// noSplitBtn = 'true' for hands being created via split
	createHand: function(splitCard, noSplitBtn){
		var base = this,
			theHand = $("<div class='hand'></div>").appendTo("#table"),
			theCards = $("<ul class='cards'></ul>").appendTo(theHand),
			theButtons = $("<ul class='buttons'></ul>"),
			cantSplit = $("<li class='cant-split'>(You don't have enough chips to split this hand.)</li>").appendTo(theButtons).hide(),
			stayBtn = $("<li class='stay'><a href='#'>Stay</a></li>").appendTo(theButtons),
			hitBtn = $("<li class='hit'><a href='#'>Hit</a></li>").appendTo(theButtons),
			splitBtn = $("<li class='split'><a href='#'>Split</a></li>"),
			result = $("<div class='result'><h2></h2><p></p></div>").appendTo(theHand),
			cards = [],
			splitCount = 0;

		/*
		// make dynamically created hand dropabble
		$(".hand").not("#dealer").droppable(this._elDropOptions);
		*/

		// If this is first deal, add 2 random cards to array
		if(splitCard == undefined) {
			for(i=0; i<2; i++){
				cards.push(this.getCard());
			};
		// Otherwise create the array with the split card and 1 random
		} else {
			cards = [splitCard, this.getCard()];
		}

		$(theCards).empty(); // Clear the markup for cards
		// Create the markup for the current hand
		for(i=0; i<cards.length; i++){
			
			$(theCards).append(this._elCardMarkup(cards[i])).hide().fadeIn(200);
			// remove a card from deck for every hit
			if(splitCount == 0){
				$("div#deck ul li:last-child").remove();
				// if this hand was created via split update splitCount so it only removes one card from deck
				if(noSplitBtn){
					splitCount = 1;
				}
			}
			
			setTimeout(function(){
				$(theCards).find("li").addClass("flip");
			}, 600);
		}

		// Create the markup for the buttons
		$(theCards).after(theButtons);

		// Set the title for the type of player
		if(splitCard == undefined){
			$(theCards).before("<h2>Player <span></span></h2>");
		} else {
			$(theCards).before("<h2>Split Hand <span></span></h2>");
		}

		// Hit Button
		$(hitBtn).bind('click', function(){
			base.hit(cards, $(this).parent().parent().find(".cards"));
			return false;
		});
		// Stay Button
		$(stayBtn).bind('click', function(){
			$(this).parent().parent().attr("id", "player-" + base.playerCount);
			base.playerCount++;
			$(this).parent().empty();
			base.arrayScores.push(base.getScore(cards, noSplitBtn));

			// deal to dealer after all players are done
			base.playersDone();
			return false;
		});

		// Add a Split Button if this is not a hand created via split
		if(!noSplitBtn){
			// determine if the cards are the same
			if(cards[0].number == cards[1].number || cards[0].value == cards[1].value){
				// player doesn't have enough chips to split. show message
				if(this.currentBet > this.playerChips) {
					$(cantSplit).fadeIn(2000);
					setTimeout(function(){
						$(cantSplit).fadeOut(1000);
					}, 4000);
				// hand can be split. show split button, split chips
				} else {
					$(splitBtn).appendTo(theButtons);
					// Split Button
					$(splitBtn).bind('click', function(){
						base.split(cards, $(this).parent().parent().find(".cards"));
						return false;
					});
					// Display Split Bet Amount
					$(this._elSplitBetTitle).fadeIn();
				}
			}
		}
	},



	hit: function(hand, target, isDealer){
		var base = this;
		var dealCard = this.getCard();
		this._boolGameStart = true;
		hand.push(dealCard);
		dealCard = "";
		var i = hand.length - 1;

		// display card and flip the last one
		$(target).append(this._elCardMarkup(hand[i]));
		$(target).find("li:last-child").hide().fadeIn(600).addClass("expand");

		setTimeout(function(){
			$(target).find("li:last-child").addClass("flip");
			if(!base._boolDropHit) {
				$("div#deck ul li:last-child").remove();
			}
			base._boolDropHit = false;
		}, 600);
		
		// End game on player bust
		if(this.getScore(hand).score > 21 && isDealer != true){
			$(target).parent().attr("id", "player-" + this.playerCount);
			this.playerCount++;

			$(target).parent().find(".buttons").empty();
			this.arrayScores.push(this.getScore(hand));
			this.bust(target);
		}

	},
	split: function(hand, target){
		var splitHand = hand.splice(1,1),
			origPlayer = $(target).parent(),
			newPlayer,
			newPlayerHand = $(newPlayer).find(".cards"),
			base = this;

		// add split bet
		this.playerChips -= this.currentBet;
		this.splitBet = this.currentBet;
		$(this._elSplitBet).text(this.splitBet);

		$(target).parent().remove();
		this.createHand(hand[0], true);
		setTimeout(function(){
			newPlayer = base.createHand(splitHand[0], true);
			$(origPlayer).after(newPlayer);
		}, 1000);
	},
	// End player's game on bust
	bust: function(target){
		var base = this,
			thisResult = $(target).parent().find(".result h2");
		$(thisResult).addClass("red").text("Bust! You lose!").hide().fadeIn();
		
		this.playersDone();
	},



	// Return the score for given hand
	getScore: function(hand, isSplitHand){
		var total = {
				score: 0,
				bj: 0
			},
			aces = 0;

		for(i=0; i<hand.length; i++){
			if(hand[i].value == 11) {
				aces += 1;
			}
			total.score += hand[i].value;

			// set value of ace to 1 if score exceeds 21
			while(total.score > 21 && aces > 0){
				total.score -= 10;
				aces--;
			}
		}
		// mark the hand as a blackjack if it's not a natural 21 or a spit hand
		if(hand.length == 2 && total.score == 21 && !isSplitHand){
			total.bj += 1;
		}
		return total;
	},
	// Check if all players have finished
	playersDone: function(){
		var base = this;
		function isBust(element, index, array) {
			return (element.score >= 22); 
		}
		// End game if all recorded scores are bust and no one is left to play
		if(this.arrayScores.every(isBust) && $(".stay").length == 0) {
			this.updateChips(this.currentBet, "lose");
			this.showBetButtons();
		// Start the dealer if all players are done and they didn't all bust
		} else if(!this.arrayScores.every(isBust) && $(".stay").length == 0){
			this.hitDealerHand();
		} 

	},
	


	// Determine who won and display message
	declareWinner: function(){
		var base = this;

		// show dealer's score
		if (this.dealerScore.bj == 1){
			$(this._elDealerScore).text("(" + this.dealerScore.score + " - Blackjack!)");
		} else {
			$(this._elDealerScore).text("(" + this.dealerScore.score + ")");
		}

		for(i=0; i<this.arrayScores.length; i++){

			var currPlayer = $("#player-" + i),
				currPlayerResult = $(currPlayer).find(".result h2");

			// show players' score
			if (this.arrayScores[i].bj == 1){
				$(currPlayer).find("h2 span").text("(" + this.arrayScores[i].score + " - Blackjack!)");
			} else {
				$(currPlayer).find("h2 span").text("(" + this.arrayScores[i].score + ")");
			}

			if(this.arrayScores[i].score > 21) {
				//do nothing. player busted
			} else if(this.arrayScores[i].score < base.dealerScore.score && !(base.dealerScore.score > 21)) {
				// dealer wins
				$(currPlayerResult).addClass("red").text("You lose!").hide().fadeIn();
				this.updateChips(this.currentBet, "lose");
			} else if(this.arrayScores[i].score > base.dealerScore.score || base.dealerScore.score > 21) {
				// player wins
				$(currPlayerResult).addClass("win").text("You win!").hide().fadeIn();
				if(this.arrayScores[i].bj > 0) {
					// player wins with blackjack
					this.updateChips(this.currentBet, "bj");
				} else {
					// player wins
					this.updateChips(this.currentBet, "win");
				}
			} else if (this.arrayScores[i].score == base.dealerScore.score) {
				// if it's a tie
				if (this.arrayScores[i].bj > base.dealerScore.bj) {
					// player wins with blackjack
					$(currPlayerResult).addClass("win").text("You win!").hide().fadeIn();
					this.updateChips(this.currentBet, "bj");
				} else if (this.arrayScores[i].bj < base.dealerScore.bj) {
					// dealer wins with blackjack
					$(currPlayerResult).addClass("red").text("You lose!").hide().fadeIn();
					this.updateChips(this.currentBet, "lose");
				} else {
					// both players tie with blackjack
					$(currPlayerResult).text("It's a draw.").hide().fadeIn();
					this.updateChips(this.currentBet, "tie");
				}
			}

		}
		this.showBetButtons();
		/*
		$(".hand").droppable("option", "disabled", true);
		*/
	},

	// reshuffle the deck
	deckEmpty: function(){
		var base = this;

		$(this._elPlayBtn).hide();
		$(this._elDealerPlaceholder).fadeIn();
		$(this._elEmptySeat).fadeIn();
		$(this._elNoCards).fadeIn();
		this.arrayDeck = [];
		
		setTimeout(function(){
			base.createDeck();
			base.play();
		}, 1500);
	},


	// Play the Game
	play: function(){
		// reset all the things
		this.arrayScores = [];
		this.playerCount = 0;
		$(this._elDealerHand).empty();
		$(this._elDealerScore).empty();
		this._handDealer = [];
		$('div[id^="player-"]').remove();
		$(this._elDealerPlaceholder).hide();
		$(this._elNoCards).hide();

		// reset the deck if not enough cards
		if(this.arrayDeck.length < 8){
			this.deckEmpty();
		} else {
			// otherwise start a new game
			this._boolGameStart = true;
			this.createDealerHand();
			this.createHand();
			$(this._elPlayBtn).hide();
			$(this._elEmptySeat).hide();	
		}
	},
	reset: function(){
		this.playerChips = 100;
		$(this._elPlayerChips).text(this.playerChips);
		this.showBetButtons();
		$(this._elPlayBtn).hide();
		$(this._elDealerHand).empty();
		$(this._elDealerScore).empty();
		$('div[id^="player-"]').remove();
		$(this._elDealerPlaceholder).fadeIn();
		$(this._elEmptySeat).fadeIn();
		this.arrayDeck = [];
		this.createDeck();
	},
	showPlayButton: function(){
		this._boolGameStart = false;
		$(this._elPlayBtn).fadeIn();
	}

}


$(function() {
	var game = new Blackjack();
		game.init();
});