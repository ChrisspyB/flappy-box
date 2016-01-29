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
	this.w = 100;
	this.h = 100;
};
Obstacle.prototype.draw = function() {
	// body...
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
	this.acc = new Vector2d(0,0);

	this.size = 10; // ideally an even number

};

Player.prototype.draw = function() {
	ctx.beginPath();
	ctx.rect(this.pos.x - this.size/2, this.pos.y - this.size/2,
		this.size, this.size);
	ctx.fillStyle = '#000000';
	ctx.fill();
	ctx.closePath();
};


function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//...
	requestAnimationFrame(draw);
}


draw();