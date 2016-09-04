// trying to make game smoother - changed v3 to use array of objects with x, y values
// mostly works. some bugs when rows shift - can jump through corners especially when going down right

var Canvas = new Object();

Canvas = {

	init: function() {
		self = this;
		// Set Static Global Vars
		// Canvas
		this._canvas = document.getElementById('canvas');
		this._canvasWidth = 800;
		this._canvasHeight = 600;
		this._context = this._canvas.getContext('2d');
		this._canvas.width = this._canvasWidth;
		this._canvas.height = this._canvasHeight;
		// Blocks
		this._numRows = 12;
		this._numCols = 16;
		this._blockWidth = this._canvasWidth / this._numCols;
		this._blockHeight = this._canvasHeight / this._numRows;
		this._arrayBlocks = [];
		this._blockDirY = 10;
		// Player
		this._playerRadius = 10;
		this._playerSpeed = 10;

		// Game Frame Rate
		this._intervalID;
		this._frameRate = 30;
		// Key Bools
		this._leftKeyDownBool = false;
		this._rightKeyDownBool = false;
		this._upKeyDownBool = false;
		this._downKeyDownBool = false;
		this._isGameActive = false;


		this.initGame();
		this.drawGame();
		this.bindEvents();

		
	},

	initGame: function() {

		// Set Dynamic Global Vars
		// Blocks
		this.blockX = 0;
		this.blockY = 0;
		this.removeRowCounter = 0;
		// Player 
		this.playerX = this._canvasWidth / 2 + this._playerRadius;
		this.playerY = this._canvasHeight - 50 + this._playerRadius;
		// initial speed
		this.gameSpeed = this._frameRate;

		// create initial array of blocks
		for(i=0; i<this._numRows; i++){
			this._arrayBlocks[i] = new Array();
			for(j=0; j<this._numCols; j++){
				this._arrayBlocks[i][j] = {
					val: 0,
					x: 0,
					y: 0
				};				
			}
		}

		this._intervalID = setInterval(self.drawGame, self._frameRate);
	},

	drawGame: function() {
		self.clearCanvas();
		self.getGridPos();
		self.drawBlocks();
		self.player();
		self.drawGrid();
	},

	drawGrid: function(){
		for(i=1; i < this._numCols; i++) {
			this.createBlock(i*this._blockWidth, 0, 1, this._canvasHeight, 'rgba(0,0,0,0.1)');
		}
		for(i=1; i < this._numRows; i++) {
			this.createBlock(0, i*this._blockHeight, this._canvasWidth, 1, 'rgba(0,0,0,0.1)');
		}

	},

	clearCanvas: function() {
		this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
	},

	addRemoveRow: function() {
		this._arrayBlocks.splice(this._arrayBlocks.length - 1, 1);

		var newRow = [];
		for(i=0; i<this._numCols; i++){
			newRow[i] = {
							val: Math.floor(Math.random()*6),
							x: 0,
							y: 0
						}				
		}
		this._arrayBlocks.unshift(newRow);
	},

	drawBlocks: function() {
		this.smoothY = Math.floor(this._blockHeight / this._frameRate * this.removeRowCounter);

		for (i=0; i<this._arrayBlocks.length; i++){
			for (j=0; j<this._arrayBlocks[i].length; j++){
				this._arrayBlocks[i][j].x = this._blockWidth * j;
				this._arrayBlocks[i][j].y = this._blockHeight * i + this.smoothY;
				if(this._arrayBlocks[i][j].val == 1) {
					this.createBlock(this._arrayBlocks[i][j].x, this._arrayBlocks[i][j].y, this._blockWidth, this._blockHeight, '#000');
				}
			}
		}

		this.removeRowCounter++;
		//if (this.removeRowCounter == this.gameSpeed*2) {
		if (this.removeRowCounter == this.gameSpeed) {
			self.addRemoveRow();
			this.removeRowCounter = 0;
			
			// if(this.gameSpeed > 5){
			// 	this.gameSpeed--;
			// 	console.log(this.gameSpeed);
			// }
		}

		// set player y pos if block above is present and within player radius
		if(this._arrayBlocks[this.gridY-1] != undefined && this._arrayBlocks[this.gridY-1][this.gridX].val==1) {

			if(this.playerY - (this._arrayBlocks[this.gridY-1][this.gridX].y + this._blockHeight) <= this._playerRadius) {

				this.playerY = this._arrayBlocks[this.gridY-1][this.gridX].y + this._blockHeight + this._playerRadius;

			}

		}
	},
	
	createBlock: function(x, y, width, height, color) {
		this._context.fillStyle = color;
		this._context.fillRect(x, y, width, height);
	},

	getGridPos: function() {
		for (i=0; i<this._numRows; i++){
			if(this.playerY >= i * this._blockHeight && this.playerY <= i * this._blockHeight + this._blockHeight){
				this.gridY = i;
			}
		}
		for (i=0; i<this._numCols; i++){
			if(this.playerX >= i * this._blockWidth && this.playerX <= i * this._blockWidth + this._blockWidth){
				this.gridX = i;
			}
		}
	},

	player: function() {

		// draw player
		this._context.beginPath();
		this._context.arc(this.playerX, this.playerY, this._playerRadius, 0, Math.PI*2, true);
		this._context.closePath();
		this._context.fill();


		 // move player LEFT
		if(this._leftKeyDownBool) {

			if	( 
					(this._arrayBlocks[this.gridY] != undefined && 
					this._arrayBlocks[this.gridY][this.gridX-1] != undefined && 
					this._arrayBlocks[this.gridY][this.gridX-1].val==1 && 
					this.playerX - (this._arrayBlocks[this.gridY][this.gridX-1].x + this._blockWidth) <= this._playerRadius &&
					this._arrayBlocks[this.gridY][this.gridX-1].y + this._blockHeight >= this.playerY &&
					this._arrayBlocks[this.gridY][this.gridX-1].y <= this.playerY) 
					|| 
					(this._arrayBlocks[this.gridY-1] != undefined && 
					this._arrayBlocks[this.gridY-1][this.gridX-1] != undefined && 
					this._arrayBlocks[this.gridY-1][this.gridX-1].val==1 && 
					this.playerX - (this._arrayBlocks[this.gridY-1][this.gridX-1].x + this._blockWidth) <= this._playerRadius &&
					this._arrayBlocks[this.gridY-1][this.gridX-1].y + this._blockHeight >= this.playerY &&
					this._arrayBlocks[this.gridY-1][this.gridX-1].y <= this.playerY)
				) {

				this._leftKeyDownBool = false;
				//this.playerX = this.gridX * this._blockWidth + this._playerRadius;
				this.playerX = this.playerX;
			} else {
				this.playerX -= this._playerSpeed;
			}

			if(this.playerX <= this._playerRadius) {
				this.playerX = this._playerRadius;
			}
		}

		 // move player RIGHT
		if(this._rightKeyDownBool) {
			
			if	( 
					(this._arrayBlocks[this.gridY] != undefined && 
					this._arrayBlocks[this.gridY][this.gridX+1] != undefined && 
					this._arrayBlocks[this.gridY][this.gridX+1].val==1 && 
					(this._arrayBlocks[this.gridY][this.gridX+1].x) - this.playerX <= this._playerRadius &&
					this._arrayBlocks[this.gridY][this.gridX+1].y + this._blockHeight >= this.playerY &&
					this._arrayBlocks[this.gridY][this.gridX+1].y <= this.playerY) 
					|| 
					(this._arrayBlocks[this.gridY-1] != undefined && 
					this._arrayBlocks[this.gridY-1][this.gridX+1] != undefined && 
					this._arrayBlocks[this.gridY-1][this.gridX+1].val==1 && 
					(this._arrayBlocks[this.gridY-1][this.gridX+1].x) - this.playerX <= this._playerRadius &&
					this._arrayBlocks[this.gridY-1][this.gridX+1].y + this._blockHeight >= this.playerY &&
					this._arrayBlocks[this.gridY-1][this.gridX+1].y <= this.playerY)
				) {
				
				this._rightKeyDownBool = false;
				//this.playerX = (this.gridX+1) * this._blockWidth - this._playerRadius;
				this.playerX = this.playerX;
			} else {
				this.playerX += this._playerSpeed;
			}

			if(this.playerX >= this._canvasWidth - this._playerRadius) {
				this.playerX = this._canvasWidth - this._playerRadius;
			}
		}

		 // move player UP
		if(this._upKeyDownBool) {

			if	(
				this._arrayBlocks[this.gridY-1] != undefined && 
				this._arrayBlocks[this.gridY-1][this.gridX].val==1 &&
				this.playerY - (this._arrayBlocks[this.gridY-1][this.gridX].y + this._blockHeight) <= this._playerRadius
				){
				
				this._upKeyDownBool = false;
				//this.playerY = this.gridY * this._blockHeight + this._playerRadius + this.smoothY;
				this.playerY = this.playerY;
			} else {
				this.playerY -= this._playerSpeed;
			}

			if(this.playerY <= this._playerRadius) {
				this.playerY = this._playerRadius;
			}
		}

		 // move player DOWN
		if(this._downKeyDownBool) {

			if	(
				this._arrayBlocks[this.gridY] != undefined && 
				this._arrayBlocks[this.gridY][this.gridX].val==1 &&
				this._arrayBlocks[this.gridY][this.gridX].y - this.playerY <= this._playerRadius
				){

				this._downKeyDownBool = false;
				//this.playerY = this._arrayBlocks[this.gridY][this.gridX].y - this._playerRadius;
				this.playerY = this.playerY;
			} else {
				this.playerY += this._playerSpeed;
			}

			if(this.playerY >= this._canvasHeight - this._playerRadius) {
				this.playerY = this._canvasHeight - this._playerRadius;
			}
		}

		if(this.playerY > this._canvasHeight){
			this.endGame();
		}

	},

	endGame: function() {
		this.clearCanvas();
		clearInterval(self._intervalID);
		this._isGameActive = false;
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
		if($keyCode===38) {
			this._upKeyDownBool = true;
		}
		if($keyCode===40) {
			this._downKeyDownBool = true;
		}
		// end game on spacebar
		if($keyCode===32) {
			this.endGame();
		}
	},
	keyUp: function($keyCode){
		if($keyCode===37) {
			this._leftKeyDownBool = false;
		}
		if($keyCode===39) {
			this._rightKeyDownBool = false;
		}
		if($keyCode===38) {
			this._upKeyDownBool = false;
		}
		if($keyCode===40) {
			this._downKeyDownBool = false;
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