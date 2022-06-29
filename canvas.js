const canvas = document.getElementById('dino-game');
const context = canvas.getContext('2d');

//Definimos as variáveis
let score;
let highscore;
let dino;
let gravity;
let obstacles = [];
let enemies;
let gameSpeed;
let keys = {};

// ArrowDown
document.addEventListener("keydown", function(e) {
    //Detectamos o evento de aperto de tecla (pra baixo)
    keys[e.code] = true;

})

// ArrowUp 
document.addEventListener("keyup", function(e) {
    //Detectamos o evento de aperto de tecla (pra cima)
    keys[e.code] = false;
})

class Dino {
    //Criamos o elemento dinossauro
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

    //Definimos o estilo do elemento
    Draw() {
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }

    Animate() {
        //Executará a ação do pulo caso seja pressionada a tela SETA P/ CIMA ou ESPAÇO
        if(keys['ArrowUp'] || keys['Space']) {
            this.Jump();
            console.log('jump');
        } else {
            this.jumpTimer = 0;
        }

        if (keys['ShiftLeft'] || keys['KeyS']) {
            this.h = this.originalHeight / 2;
        } else {
            this.h = this.originalHeight;
        }

        this.y += this.dy; 

        // Animação realizada caso a condição seja válida (da posição que está no Y e na altura
        //Caso seja invalido significa que ele ta no chao
        if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0
            this.grounded = true;
            this.y = canvas.height - this.h;
        }
    

        this.Draw();
    }

    //Verificamos se está no chão e validamos o tempo do pulo
    Jump() {
        if(this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }
}

class Obstacle {
    constructor (x, y, w, h, c) {
        this.x = x;
        this.y = y
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
    }

    Update () {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw () {
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }
}

// Game Functions
function SpawnObstacle() {
    let size = RandomIntInRange(20, 70);
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size,
        size, size, '#2484E4');

    if (type == 1) {
        obstacle.y -= dino.originalHeight - 10;
    }

    obstacles.push(obstacle);
}

SpawnObstacle();

function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);

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

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update() {
    requestAnimationFrame(Update)
    context.clearRect(0, 0, canvas.width, canvas.height)

    dino.Animate()
}

init();