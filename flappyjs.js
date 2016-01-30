'use strict'

console.log('Running flappyjs.js');

var canvas = document.getElementById('canvasFB'); // the canvas element
var ctx = canvas.getContext('2d'); // the canvas rendering context

var GLOBALS = {
	obsSpeed : -5
};
var game = {obsSpeed : GLOBALS.obsSpeed};

var highscore = 0; // Could try store this serverside.
var score = 0;
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
Vector2d.prototype.set = function(x,y) {
	this.x = x;
	this.y = y;
};
var Obstacle = function(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w; // half of the width
	this.h = h;
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
	this.spacing = 275;
	this.padding = 5; //defines space where obstacle's holes cannot be
	this.leader = 0; //which obstacle passes player next?
	this.w = 40; // half of the width
	this.h = 40; // half height of hole
};
ObstacleController.prototype.reset = function() {
	for (var i=0; i<this.obstacles.length; i++){
		var obs = this.obstacles[i];
		obs.x = canvas.width+i*this.spacing
		obs.y = this.padding + this.h + Math.floor(Math.random()*
				(canvas.height -2 * (this.padding + this.h)));
	}
	this.leader = 0;
};
ObstacleController.prototype.spawnObstacles = function(n) {
	for (var i=0; i<n; i++){
		this.obstacles.push(
			new Obstacle(canvas.width+i*this.spacing,i*50,
				this.w,this.h));
	}
};

ObstacleController.prototype.update = function(player){
	for (var i=0; i<this.obstacles.length; i++){
		var obs = this.obstacles[i];
		if (obs.outOfBounds()){
			obs.x+=this.obstacles.length*this.spacing;
			obs.y = this.padding + this.h + Math.floor(Math.random()*
				(canvas.height -2 * (this.padding + this.h)));
			continue;
		}
		obs.x+=game.obsSpeed;
		obs.draw();
	}
	this.checkCollision(player);
};

ObstacleController.prototype.checkCollision = function(p) {
	if(p.pos.x < this.obstacles[this.leader].x-this.obstacles[this.leader].w){ 
		return; 
	}
	var ob = this.obstacles[this.leader];
	if (p.pos.x > ob.x+this.w) {
		this.leader++;
		score++;
		if (this.leader>=this.obstacles.length){
			this.leader = 0;
		}
	}
	else if(p.pos.y<ob.y-ob.h || p.pos.y>ob.y+ob.h){ 
		//collision...
		restart();
	}

	return;
};

var Player = function(x,y){
	this.pos = new Vector2d(x,y); // position of player's centre
	this.vel = new Vector2d(0,0);
	this.acc = new Vector2d(0,0.7);
	this.size = 20; // ideally an even number
	this.init(x,y);
};

Player.prototype.init = function(x,y) {
	//for initialisation and reset.
	this.pos.set(x,y);
	this.vel.set(0,0);
	this.frozen = false;
	this.canJump = true;
	this.jumpDelay = 5;
	this.jumpTimer = 0;
	this.jumpSpd = -6; // Vertical speed after jumping
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

var drawScore = function(first_argument) {
	ctx.font='16px Arial';;
	ctx.fillStyle = score>highscore ? '#DD0000':'#0095DD';
	ctx.fillText('Score: '+score,8,20);
	ctx.fillStyle = '#0095DD';
	ctx.fillText('Highscore: '+highscore,8,40);
};
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

var p1 = new Player(50,50);
var oc = new ObstacleController();
oc.spawnObstacles(3);

var restart = function(){
	highscore=highscore>=score ? highscore:score;
	p1.init(50,50);
	oc.reset();
	score = 0;
};
var update = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	p1.update();
	p1.draw();
	oc.update(p1);
	drawScore();
	// requestAnimationFrame(update);
}

setInterval(update,30);
// update();