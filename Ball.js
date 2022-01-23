
var Ball = (function () {
    function Ball(canvas, centerX, centerY, radius) {
        this._canvas = canvas;
		
		this._centerX = centerX;
		this._centerY = centerY;
		this._radius = radius;

		this._lock = false;
		this._lockPositionX = 0.0;
		this._lockPositionY = 0.0;
		this._unlockPositionX = 0.0;
		this._unlockPositionY = 0.0;
		this._stoppage = 0.002;

		this._directionX = 0;
		this._directionY = 0;

		this._lockTime = 0;
		this._unlockTime = 0;

		this._velocity = 0.0;
		this._lastRenderTime = null;
		
		var self = this;
		
		canvas.addEventListener("mousemove", function(event) { self.mouseMove(event);});
		canvas.addEventListener("mousedown", function(event) { self.mouseDown(event);});
		canvas.addEventListener("mouseup", function(event) { self.mouseUp(event);});
		
		this.render();
    }
    Ball.prototype.render = function () {
		var currentTime = new Date().getTime();
	
		if(!this._lastRenderTime)
			this._lastRenderTime = currentTime;
		
		var elapsedTime = currentTime - this._lastRenderTime;
		this.drawBall(elapsedTime);
	
		if(elapsedTime > 0.0)
			this._lastRenderTime = currentTime;
	
		var self = this;
		window.requestAnimationFrame(function(){ self.render(); });
    };
	Ball.prototype.mouseDown = function(event) {
		var x = event.clientX;
		var y = event.clientY;
		
		var relativeX = x - this._centerX; 
		var relativeY = y - this._centerY;
		
		var length = Math.sqrt(relativeX * relativeX +
								relativeY * relativeY);
		
		if(length <= this._radius){
			this._lockTime = new Date().getTime();
			
			this._lockPositionX = this._centerX;
			this._lockPositionY = this._centerY;
			
			this._lock = true;
		}
	};
	Ball.prototype.mouseUp = function(event) {
		this._unlockTime = new Date().getTime();
		
		this._unlockPositionX = this._centerX;
		this._unlockPositionY = this._centerY;
		
		this._directionX = this._unlockPositionX - this._lockPositionX;
		this._directionY = this._unlockPositionY - this._lockPositionY;
		
		var magnitude = Math.sqrt(this._directionX * this._directionX +
									this._directionY * this._directionY);
									
		if(magnitude != 0.0)
		{
			this._directionX *= 1.0 / magnitude;
			this._directionY *= 1.0 / magnitude;
		}
		
		this._velocity = magnitude / (this._unlockTime - this._lockTime);
		this._lock = false;
	};

	Ball.prototype.mouseMove = function(event) {
		if(this._lock == true) {
			this._centerX += event.movementX;
			this._centerY += event.movementY;
		}
	};
	Ball.prototype.drawBall = function(elapsedTime) {
		var context = this._canvas.getContext("2d");
	
		context.clearRect(0,
						0,
						this._canvas.width,
						this._canvas.height);
		
		var randomAngle = (Math.PI / 180.0) * (Math.random() * 180.0);
		var randomAngleCosinePositive = Math.cos(randomAngle);
		var randomAngleSinePositive = Math.sin(randomAngle);
		var randomAngleCosineNegative = Math.cos(-randomAngle);
		var randomAngleSineNegative = Math.sin(-randomAngle);
		
		var UnitYX = 0.0;
		var UnitYY = 1.0;
		var UnitXX = 1.0;
		var UnitXY = 0.0;	
		
		var movement = this._velocity * elapsedTime;
		this._velocity -= this._stoppage * elapsedTime;
		
		if(this._velocity < 0.0)
			this._velocity = 0.0;
		
		if(this._centerX + this._radius >= this._canvas.width){
			this._directionX = UnitYX * randomAngleCosinePositive - UnitYY * randomAngleSinePositive;
			this._directionY = UnitYX * randomAngleSinePositive + UnitYY * randomAngleCosinePositive;
		}
		if(this._centerX - this._radius <= 0.0){
			this._directionX = UnitYX * randomAngleCosineNegative - UnitYY * randomAngleSineNegative;
			this._directionY = UnitYX * randomAngleSineNegative + UnitYY * randomAngleCosineNegative;
		}
		if(this._centerY - this._radius <= 0.0) {
			this._directionX = UnitXX * randomAngleCosinePositive - UnitXY * randomAngleSinePositive;
			this._directionY = UnitXX * randomAngleSinePositive + UnitXY * randomAngleCosinePositive;
		}
		if(this._centerY + this._radius >= this._canvas.height) {
			this._directionX = UnitXX * randomAngleCosineNegative - UnitXY * randomAngleSineNegative;
			this._directionY = UnitXX * randomAngleSineNegative + UnitXY * randomAngleCosineNegative;
		}
		
		this._centerX += this._directionX * movement;
		this._centerY += this._directionY * movement;
		
		context.beginPath();
			context.arc(this._centerX,
						this._centerY,
						this._radius,
						0,
						Math.PI * 2,
						false); 
					
		context.closePath();
		context.fillStyle = "red";
		context.fill();
	};
    return Ball;
})();
