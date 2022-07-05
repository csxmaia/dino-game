const canvas = document.getElementById('dino-game');
const context = canvas.getContext('2d');
const dinoNormal = document.getElementById("dino-normal");
const dinoAgachado = document.getElementById("dino-rebaixado");

//Definimos as variáveis
let score;
let scoreText;
let highscore;
let highscoreText;
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

        this.originalHeight = h;

        this.dy = 0;
        this.jumpForce = 15;
        this.grounded = false;
        this.jumpTimer = 0;
        this.dinoAgachado = false;
    }

    //Função para desenhar o Dino na Tela com a cor #000 e nas suas posições
    Draw() {
        context.beginPath();
        context.fillStyle = "#000";
       

        if (this.dinoAgachado) {
            context.drawImage(dinoAgachado, this.x, this.y, this.w, this.h);
        } else {
            context.drawImage(dinoNormal, this.x, this.y, this.w, this.h);
        }

        //context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }

    //Função responsavel por animar o Dino, sempre executada
    Animate() {
        //Executará a ação do pulo caso seja pressionada a tela SETA P/ CIMA ou ESPAÇO
        if(keys['ArrowUp'] || keys['Space']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }

        if (keys['ArrowDown'] || keys['KeyS']) {
            this.dinoAgachado = true;
            this.h = this.originalHeight / 2;
        } else {
            this.dinoAgachado = false;
            this.h = this.originalHeight;
        }

        
        this.y += this.dy; 

        // se a posição de y do dino + a sua altura (altura do objeto do dino) é menor que canvas.height (borda final do canvas/chão), 
        // quer dizer que o dino nã está no chão, logo
        if (this.y + this.h < canvas.height) {
            // a gravidade será aplicada no atributo dy
            this.dy += gravity;
            // atributo de estar no chão será setado como false
            this.grounded = false;
        } else {
            // o atributo que aplica gravidade será zerado, pois não será mais necessario aplicar a gravidade no objeto
            this.dy = 0
            // o objeto está no chão, logo setado como true
            this.grounded = true;
            // seta o y na posicao original, para garantir a total queda
            // this.y = canvas.height - this.h;
            this.y = this.originalHeight;
        }
    
        // irá desenhar o objeto na tela novamnete com as posições atualizadas
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

class Text {
    constructor (t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw() {
        context.beginPath();
        context.fillStyle = this.c;
        context.font = this.s + "px sans-serif";
        context.textAlign = this.a;
        context.fillText(this.t, this.x, this.y);
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


//Função inicial
function init() {
    //pega as dimensões da tela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.font = "20px sans-serif";

    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;

    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore');
    }

    dino = new Dino(25, canvas.height - 150, 100, 100);

    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 25,
        25, "right", "#212121", "20");

    requestAnimationFrame(Update)
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

//
function Update() {
    requestAnimationFrame(Update)
    context.clearRect(0, 0, canvas.width, canvas.height)

    spawnTimer--;
    if (spawnTimer <= 0) {
        SpawnObstacle();
        console.log(obstacles);

        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60) {
            spawnTimer = 60;

        }
    }

    // Spawn Enemies
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];

        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
        }

        if (dino.x < o.x + o.w
            && dino.x + dino.w > o.x
            && dino.y < o.y + o.h
            && dino.y + dino.h > o.y) {
            obstacles = [];
            score = 0;
            spawnTimer = initialSpawnTimer;
            gameSpeed = 3;
            window.localStorage.setItem('highscore', highscore);
        }

        o.Update();
    }

    dino.Animate();

    score++;
    scoreText.t = "Score: " + score;
    scoreText.Draw();
    
    if (score > highscore) {
        highscore = score;
        highscoreText.t = "Highscore: " + highscore;
    }

    highscoreText.Draw();


    gameSpeed += 0.003;
}

init();