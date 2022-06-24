const canvas = document.getElementById('dino-game');
const context = canvas.getContext('2d');

let score;
let highscore;
let dino;
let gravity;
let enemies;
let gameSpeed;
let keys = {};

// ArrowDown
document.addEventListener("keydown", function(e) {
    keys[e.code] = true;
})

// ArrowUp 
document.addEventListener("keyup", function(e) {
    keys[e.code] = false;
})

class Dino {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;
    }

    Draw() {
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }

    Animate() {
        if(keys['ArrowUp']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }

        if(this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0
            this.grounded = true;
            this.y = canvas.height - this.h;
        }

        this.y += this.dy; 

        this.Draw();
    }

    Jump() {
        if(this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = - this.jumpForce;
        }
    }
}

function init() {
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;

    context.font = "20px sans-serif";

    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;

    dino = new Dino(25, canvas.height - 150, 50, 50);

    requestAnimationFrame(Update)
}

function Update() {
    requestAnimationFrame(Update)
    context.clearRect(0, 0, canvas.width, canvas.height)

    dino.Animate()
}

init();