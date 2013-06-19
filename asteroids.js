var Asteroids = (function() {
	function MovingObject(x, y, r){
		this.positionX = x;
		this.positionY = y;
		this.radius = r;

		this.update = function(){
			this.positionX += this.dx;
			this.positionY += this.dy;
		}

		this.offscreen = function(){
			if ((this.positionX < 0 || this.positionX > 800) ||
				  (this.positionY < 0 || this.positionY > 800)) {
				return true;
			}
			return false;
		}
	}

	function Asteroid(x, y, r){
		MovingObject.call(this, x, y, r);
		this.speed = 1;
		this.dx = (Math.random() < 0.5) ?
		-this.speed * Math.random() : this.speed * Math.random();
		this.dy = (Math.random() < 0.5) ?
		-this.speed * Math.random() : this.speed * Math.random();
	}

	function E(){
		this.constructor = new Asteroid();
	}

	E.prototype = MovingObject.prototype;
	Asteroid.prototype = new E();

	Asteroid.randomAsteroid = function(maxX, maxY, r){
		return new Asteroid(
			maxX * Math.random(),
			maxY * Math.random(),
			r);
	};


	Asteroid.prototype.draw = function(ctx){

		ctx.fillStyle = "red";
		ctx.beginPath();

		if (this.positionX < 0) {
			this.positionX += 800;
		} else {
			this.positionX %= 800;
		};

		if (this.positionY < 0) {
			this.positionY += 800;
		} else {
			this.positionY %= 800;
		};

		ctx.arc(
			this.positionX,
			this.positionY,
			this.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};

	function Game(xDim, yDim, numAsteroids){
		this.xDim = xDim;
		this.yDim = yDim;
		this.numAsteroids = numAsteroids;
		this.ship = new Ship(xDim/2, yDim/2, 8);
		this.asteroids = [];

		for (var i = 0; i < numAsteroids; i++) {
			this.asteroids.push(Asteroid.randomAsteroid(this.xDim, this.yDim, 20));
		}
	}

	Game.prototype.render = function(ctx){
		ctx.clearRect(0, 0, this.xDim, this.yDim);

		this.ship.draw(ctx);

		for (var i = 0; i < this.ship.bullets.length; i++) {
			this.ship.bullets[i].draw(ctx);
		}


		for (var i = 0; i < this.asteroids.length; i++){
			this.asteroids[i].draw(ctx);
		}
	}

	Game.prototype.start = function(canvasEl){
		var ctx = canvasEl.getContext("2d");

		var that = this;

		that.updateAndRender = window.setInterval(function(){
			that.update();
			that.render(ctx);
		}, 1/60 * 1000);

	};

	Game.prototype.update = function(){

		var that = this;
		key('up', function(){
			that.ship.power(0, -0.5);
		})
		key('down', function(){
			that.ship.power(0, 0.5);
		})

		key('left', function(){
			that.ship.power(-0.5, 0);
		})

		key('right', function(){
			that.ship.power(0.5, 0);
		})

		key('s', function(){
			console.log("firing bullet")
			that.ship.fireBullet();
		})

		this.ship.update();
		for (var i = 0; i < this.ship.bullets.length; i++) {
			var currBullet = this.ship.bullets[i]
			currBullet.update();
			if ((currBullet.positionX < 0) || (currBullet.positionX > 800) ||
    		 (currBullet.positionY < 0) || (currBullet.positionY > 800)) {
					 this.ship.bullets.splice(i, i);
				 }
		}

		for (var i = 0; i < this.asteroids.length; i++){
 	  	this.asteroids[i].update();
		}

		this.ship.bulletHit(this.asteroids, this.numAsteroids);

		var that = this;
		if (this.ship.isHit(this.asteroids)) {
			console.log("Game Over!");
			alert("Game Over!");
			window.clearInterval(that.updateAndRender);
		}
	}

	function Ship(x, y, r){
		MovingObject.call(this, x, y, r);
		this.dx = 1;
		this.dy = 1;
		this.bullets = [];
	}

	function F(){
		this.constructor = new Ship();
	}

	F.prototype = MovingObject.prototype;
	Ship.prototype = new F();

	Ship.prototype.draw = function(ctx){

		ctx.strokeStyle = "green";
		ctx.fillStyle = "black";

		if (this.positionX < 0) {
			this.positionX += 800;
		} else {
			this.positionX %= 800;
		};

		if (this.positionY < 0) {
			this.positionY += 800;
		} else {
			this.positionY %= 800;
		};

		ctx.beginPath();
		ctx.moveTo(this.positionX, this.positionY);
		ctx.lineTo(this.positionX + 20, this.positionY);
		ctx.lineTo(this.positionX + 10, this.positionY - 20);
		ctx.lineTo(this.positionX, this.positionY);
		ctx.stroke();

		ctx.fill();
	}

	Ship.prototype.isHit = function(asteroids){

		for(var i=0; i < asteroids.length; i++){

			var xDifference = (asteroids[i].positionX - this.positionX);
	    var yDifference = (asteroids[i].positionY - this.positionY);
			var distance = Math.sqrt(xDifference * xDifference +
														   yDifference * yDifference);

			if (distance < (this.radius + asteroids[i].radius)){
				return true;
			}
		}
		return false;
	}

	Ship.prototype.power = function(ax, ay){
		this.dx += ax;
		this.dy += ay;
		if (this.dx > 3) {
			this.dx = 3;
		}
		if (this.dy > 3) {
			this.dy = 3;
		}
		if (this.dx < -3) {
			this.dx = -3;
		}
		if (this.dy < -3) {
			this.dy = -3;
		}
	}

	function Bullet(x, y, r){
		MovingObject.call(this, x, y, r);
		this.direction = 0;
		this.dx = 5;
		this.dy = 5;
	}

	function G(){
		this.constructor = new Bullet();
	}

	G.prototype = MovingObject.prototype;

	Bullet.prototype = new G();

	Bullet.prototype.draw = function(ctx){
		ctx.fillStyle = "green";
		ctx.beginPath();

		ctx.arc(
			this.positionX,
			this.positionY,
			this.radius,
			0,
			2 * Math.PI,
			false
		);
		ctx.fill();
	}

	Ship.prototype.fireBullet = function(){
		var posX = this.positionX;
		var posY = this.positionY;
		this.bullets.push(new Bullet(posX, posY, 5));
	}

	Ship.prototype.bulletHit = function(asteroids, numAsteroids){

		var survivedAsteroids = [];
		var survivedBullets = [];

		for(var i=0; i < asteroids.length; i++){
			for(var j=0; j < this.bullets.length; j++){
				var currBullet = this.bullets[j];

				var xDifference = (asteroids[i].positionX - currBullet.positionX);
		    var yDifference = (asteroids[i].positionY - currBullet.positionY);
				var distance = Math.sqrt(xDifference * xDifference +
															   yDifference * yDifference);

				if (!(distance < (currBullet.radius + asteroids[i].radius))){
					survivedAsteroids.push(asteroids[i]);
					survivedBullets.push(currBullet);
				}
			}
		}

		console.log(survivedAsteroids.length)

		if (survivedAsteroids.length < numAsteroids) {
			for (var i = survivedAsteroids.length; i < numAsteroids; i++){
			  survivedAsteroids.push(Asteroid.randomAsteroid(1, 1, 20));
			}
		}

		this.bullets = survivedBullets;
		asteroids = survivedAsteroids;
	}

	return {
		Asteroid: Asteroid,
		Ship: Ship,
		Game: Game
	};
})();