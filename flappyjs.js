'use strict'

console.log('Running flappyjs.js');

var canvas = document.getElementById('canvasFB'); // the canvas element
var ctx = canvas.getContext('2d'); // the canvas rendering context

var GLOBALS = {obsSpeed : -5};
var game = {obsSpeed : GLOBALS.obsSpeed};

var highscore = 0; // Could try store this serverside.
var spacePressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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
var Obstacle = function(x,y,s) {
	this.x = x;
	this.y = y;
	this.siblings = s; // # fellow boxes
	this.w = 25; // half of the width
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

var ObstacleController = function(){
	this.obstacles = [];
	this.spacing = canvas.width/2;
};

ObstacleController.prototype.spawnObstacles = function(n) {
	for (var i=0; i<n; i++){
		this.obstacles.push(new Obstacle(canvas.width+i*this.spacing,i*50,n));
	}
};

ObstacleController.prototype.update = function(){
	for (var i=0; i<this.obstacles.length; i++){
		var obs = this.obstacles[i];
		if (obs.outOfBounds()){
			obs.x+=this.obstacles.length*this.spacing;
			continue;
		}
		obs.x+=game.obsSpeed;
		obs.draw();
	}
};

ObstacleController.prototype.checkCollision = function() {
	//..
};

var Player = function(x,y){
	this.pos = new Vector2d(x,y); // position of player's centre
	this.vel = new Vector2d(0,0);
	this.acc = new Vector2d(0,0.5);
	this.frozen = false;
	this.canJump = true;
	this.jumpDelay = 5;
	this.jumpTimer = 0;
	this.jumpSpd = -5; // Vertical speed after jumping
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
	if (this.jumpTimer<this.jumpDelay){
		this.jumpTimer++;
	}else if (!this.canJump) {
		this.canJump = true;
	}
	if (this.frozen){ return; }
	if (this.canJump && spacePressed){
		this.vel.y = this.jumpSpd;
		this.canJump = false;
		this.jumpTimer=0;
	}
	this.pos.add(this.vel);
	this.vel.add(this.acc);
};

var GameController = function(){
	this.state = 0; // ..use bitflags?
	this.player = new Player(50,50);
	this.oc = ObstacleController();
};

var p1 = new Player(50,50);
var oc = new ObstacleController();

oc.spawnObstacles(3);

function keyDownHandler(e){
	if (e.keyCode == 32){
		spacePressed = true;
	}
};
function keyUpHandler(e){
	if (e.keyCode == 32){
		spacePressed = false;
	}
};

var update = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	p1.update();
	oc.update();
	p1.draw();
}

setInterval(update,30);