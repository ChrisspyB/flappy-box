'use strict'

console.log('Running flappyjs.js');

var canvas = document.getElementById('canvasBO'); // the canvas element
var ctx = canvas.getContext('2d'); // the canvas rendering context

var GLOBALS = {obsSpeed : 5};
var game = {obsSpeed : GLOBALS.obsSpeed};

var highscore = 0; // Could try store this serverside.

var Vector2d  = function (x,y) {
	this.x = x;
	this.y = y;
};
Vector2d.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
};
Vector2d.prototype.mult = function(s) {
	this.x *= s;
	this.y *= s;
};
var Obstacle = function(x,y) {
	this.x = x;
	this.y = y;
	this.w = 100; // half of the width
	this.h = 30;
};
Obstacle.prototype.draw = function() {
	ctx.beginPath();
	ctx.rect(this.x-this.w, 0, this.w+this.w, this.y-this.h);
	ctx.rect(this.x-this.w, this.y+this.h,
		this.w+this.w, canvas.height-this.y+this.h);
	ctx.fillStyle = '#000000';
	ctx.fill();
	ctx.closePath();
};

Obstacle.prototype.outOfBounds = function() {
	if (this.x + this.w < 0){ return true; }
	return false;
};

Obstacle.prototype.update = function() {
	this.x+=game.obsSpeed;
	this.draw; // * Only redraw when game is running!
};

var ObstacleController = function(){
	this.obstacles = [];
	this.spawnTime = 60; //.."time" between spawns
};

ObstacleController.prototype.spawnObstacle = function() {
	// body...
	//don't delete and respawn, have calc the maximum that can be seen at once
};

ObstacleController.prototype.checkCollision = function() {
	// body...
	//player's x does not change!
};

var Player = function(x,y){
	this.pos = new Vector2d(x,y); // position of player's centre
	this.vel = new Vector2d(0,0);
	this.acc = new Vector2d(0,0.100);
	this.frozen = false;
	this.canJump = false;
	this.size = 20; // ideally an even number
};

Player.prototype.draw = function() {
	ctx.beginPath();
	ctx.rect(this.pos.x - this.size/2, this.pos.y - this.size/2,
		this.size, this.size);
	ctx.rect(this.pos.x - this.size/4, this.pos.y - this.size/4,
		this.size/2, this.size/2);
	ctx.fillStyle = '#000000';
	ctx.fill();
	ctx.closePath();
};

Player.prototype.update = function() {
	if (!this.frozen){	
		p1.pos.add(p1.vel);
		p1.vel.add(p1.acc);
	}
};

var GameController = function(){
	this.state = 0; // ..use bitflags?
	this.player = new Player(50,50);
	this.oc = ObstacleController();
};

var p1 = new Player(50,50);
var o1 = new Obstacle(200,100);
var oc = new ObstacleController();


var update = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	p1.update();
	o1.update();

	p1.draw();
	o1.draw();
	//...
	// requestAnimationFrame(draw);
}

// draw(); 
setInterval(update,100);