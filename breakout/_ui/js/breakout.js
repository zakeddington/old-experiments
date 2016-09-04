// can control ball direction with movement of paddle on impact

var Canvas = new Object();

Canvas = {

	init: function() {
		self = this;
		// Set Static Global Vars
		// Canvas
		this._canvas = document.getElementById('canvas');
		this._canvasWidth = 800;
		this._canvasHeight = 550;
		this._context = this._canvas.getContext('2d');
		this._canvas.width = this._canvasWidth;
		this._canvas.height = this._canvasHeight;
		// Blocks
		this._numRows = 4;
		this._numCols = 8;
		this._blockWidth = this._canvasWidth / this._numCols;
		this._blockHeight = 20;
		this._arrayBlocks = [];
		// Paddle
		this._paddleWidth = 150;
		this._paddleHeight = 20;
		this._paddleSpeed = 20;
		// Ball
		this._ballRadius = 20;
		// Ball Direction
		this._dirX = 10;
		this._dirY = 10;
		// Game Frame Rate
		this._intervalID;
		this._gameSpeed = 30;
		// Key Bools
		this._leftKeyDownBool = false;
		this._rightKeyDownBool = false;
		this._isGameActive = false;


		this.initGame();
		this.drawGame();
		this.bindEvents();

		// Draw start text
		this._context.font = 'bold 20px sans-serif';
		this._context.textAlign = 'center';
		this._startBtn = this._context.fillText('Hit Enter to Start', this._canvasWidth/2, this._canvasHeight/2);
		
	},

	initGame: function() {

		// Set Dynamic Global Vars
		// Blocks
		this.numRows = this._numRows;
		this.numCols = this._numCols;
		this.blockX = 0;
		this.blockY = 0;
		this.blockCount = this._numRows * this._numCols;
		// Paddle Coordinates
		this.paddleX = this._canvasWidth / 2;
		this.paddleY = this._canvasHeight - 50;
		// Ball Direction
		this.dirX = this._dirX;
		this.dirY = this._dirY;
		// Ball coordinates
		this.ballX = Math.floor(Math.random() * (this._canvasWidth - this._blockWidth) + this._ballRadius);
		this.ballY = (this.numRows * this._blockHeight) + (this._ballRadius * 2);
		// Lives
		this.playerLives = 3;

		// create initial array of blocks
		for (i=0; i<this.numCols; i++) {
			this._arrayBlocks[i] = new Array();
			for(j=0; j<this.numRows; j++){
				this._arrayBlocks[i][j] = 1;
			}
		}
	},

	drawGame: function() {
		self.clearCanvas();
		self.paddle();
		self.drawBlocks();
		self.ball();
		self.removeBlocks();
		self._context.font = 'bold 14px sans-serif';	
		self._context.textAlign = 'left';
		self._context.fillText("Lives: " + self.playerLives, 20, self._canvasHeight - 10);
	},

	clearCanvas: function() {
		this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
	},

	ball: function() {
		// draw ball
		this._context.beginPath();
		this._context.arc(this.ballX, this.ballY, this._ballRadius, 0, Math.PI*2, true);
		this._context.closePath();
		this._context.fill();

		// detect collision with canvas left/right edges
		if(this.ballX <= this._ballRadius - this.dirX || this.ballX >= this._canvasWidth - this._ballRadius) {
			this.dirX = -this.dirX;
		}
		// detect collision with paddle
		if(this.ballX >= this.paddleX - this._ballRadius && this.ballX <= this.paddleX + this._paddleWidth + this._ballRadius) {
			if(this.ballY == this.paddleY - this._ballRadius) {

				// increase/decrease angle of ball if paddle is moving on impact
				if(this._leftKeyDownBool) {
					if(this.dirX > 0) {
						this.dirX = this.dirX * 0.8;
					} else {
						this.dirX = this.dirX * 1.2;
					}
				} 
				if(this._rightKeyDownBool) {
					if(this.dirX > 0) {
						this.dirX = this.dirX * 1.3;
					} else {
						this.dirX = this.dirX * 0.8;
					}
				}
				this.dirY = -this.dirY;
			}
		}
		// detect collision with canvas bottom
		if(this.ballY > this._canvasHeight) {
			this.playerLives --;
			if(this.playerLives <= 0) {
				this.endGame();
			} else {
				this.pauseGame();
			}
		}
		// detect collision with canvas top
		if(this.ballY < this._blockHeight - this.dirY) {
			this.dirY = -this.dirY;
		}

		this.ballX += this.dirX;
		this.ballY += this.dirY;
	},

	paddle: function() {
		// draw paddle
		this._context.fillRect(this.paddleX, this.paddleY, this._paddleWidth, this._paddleHeight);

		 // move paddle left
		if(this._leftKeyDownBool) {
			this.paddleX -= this._paddleSpeed;
			if(this.paddleX <= 0) {
				this.paddleX = 0;
			}
		}
		 // move paddle right
		if(this._rightKeyDownBool) {
			this.paddleX += this._paddleSpeed;
			if(this.paddleX >= this._canvasWidth - this._paddleWidth) {
				this.paddleX = this._canvasWidth - this._paddleWidth;
			}
		}
	},

	drawBlocks: function() {
		for (i=0; i<this.numCols; i++) {
			for (j=0; j<this.numRows; j++){
				this.blockX = this._blockWidth * i;
				this.blockY = this._blockHeight * j;
				if(this._arrayBlocks[i][j] == 1) {
					this.createBlock(this.blockX, this.blockY, this._blockWidth, this._blockHeight);
				}
			}
		}
	},

	createBlock: function(x, y, width, height) {
		this._context.strokeStyle = 'white';
		this._context.fillRect(x, y, width, height);
		this._context.strokeRect(x, y, width, height);
	},

	removeBlocks: function() {

		for(i=0; i<this.numCols; i++) {
			var rows = this._arrayBlocks[i].length - 1;
			if (rows < 0) {
				rows = 0;
			}
			
			if(this.ballX >= i * this._blockWidth && this.ballX <= i * this._blockWidth + this._blockWidth) {
				if(this.ballY <= this._ballRadius - this.dirY + this._blockHeight * rows) {
					if(rows >= 0 && this._arrayBlocks[i].length) {
						this._arrayBlocks[i].splice(rows, 1);
						this.dirY = -this.dirY;
						this.blockCount --;
					}
				}
			}
			
		}
		if(this.blockCount == 0) {
			this.endGame();
		}

	},

	endGame: function() {
		this.clearCanvas();
		clearInterval(self._intervalID);
		this._context.font = 'bold 20px sans-serif';
		this._context.textAlign = 'center';
		this._startBtn = this._context.fillText('Play Again', this._canvasWidth/2, this._canvasHeight/2);
		this._isGameActive = false;
	},
	pauseGame: function() {
		clearInterval(self._intervalID);
		setTimeout(function() {
			self.unPauseGame();
		}, 500);
	},
	unPauseGame: function() {
		// reset the ball position/angle
		this.dirX = this._dirX;
		this.dirY = this._dirY;
		this.ballX = Math.floor(Math.random() * this._canvasWidth);
		this.ballY = (this.numRows * this._blockHeight) + (this._ballRadius * 2);
		clearInterval(self._intervalID);
		this._intervalID = setInterval(self.drawGame, self._gameSpeed);
	},
	restartGame: function() {
		this.initGame();
		clearInterval(self._intervalID);
		this._intervalID = setInterval(self.drawGame, self._gameSpeed);
	},

	bindEvents: function() {
		$(document).keydown(function(event){
			Canvas.keyDown(event.keyCode);
		});	
		$(document).keyup(function(event){
			Canvas.keyUp(event.keyCode);
		});
	},

	keyDown: function($keyCode){
		if($keyCode===37) {
			this._leftKeyDownBool = true;
		}
		if($keyCode===39) {
			this._rightKeyDownBool = true;
		}
	},
	keyUp: function($keyCode){
		if($keyCode===37) {
			this._leftKeyDownBool = false;
		}
		if($keyCode===39) {
			this._rightKeyDownBool = false;
		}
		if($keyCode===13){
			if(this._isGameActive){
				// do nothing, game is already started
			} else {
				this._isGameActive = true;
				this.restartGame();
			}
		}
	}

}

$(document).ready(function() {
	Canvas.init();

});