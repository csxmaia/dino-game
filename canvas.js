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
let loseMenu;
let loseMenuContainer;
let loseMenuTextColor = "#000";

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
            this.y = canvas.height - this.h;
            // this.y = this.originalHeight;
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

    removeObstacle(position) {
        obstacles.splice(position, 1);
    }
}

class Text {
    constructor (text, positionX, positionY, align, color, size) {
        this.text = text;
        this.positionX = positionX;
        this.positionY = positionY;
        this.align = align;
        this.color = color;
        this.size = size;
    }

    Draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.font = this.size + "px sans-serif";
        context.textAlign = this.align;
        context.fillText(this.text, this.positionX, this.positionY);
        context.closePath();
    }
}


class Rectangle {
    constructor(color, height, width, positionX, positionY) {
        this.color = color;
        this.height = height;
        this.width = width;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    Draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.positionX, this.positionY, this.width, this.height);
        context.stroke();
        context.closePath();
    }
}

function SpawnObstacle() {
    let size = 60;
    let type = Math.round(Math.random() * (1 - 0) + 0);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size,
        size, size, '#2484E4');

    if (type == 1) {
        obstacle.y -= dino.originalHeight - 10;
    }

    obstacles.push(obstacle);
}

function gameLoseUpdate() {
    let menuHeight = 400;
    let menuWidth = 800;
    let menuPositionX = canvas.width/2 - menuWidth/2;
    let menuPositionY = canvas.height/2 - menuHeight/2;
    loseMenuContainer = new Rectangle('#808080', menuHeight, menuWidth, menuPositionX, menuPositionY);
    
    let textGameOverPositionX = menuPositionX + (menuWidth/2);
    let textGameOverPositionY = menuPositionY + (menuHeight/3.5);

    gameOverText = new Text("Game Over", textGameOverPositionX, textGameOverPositionY, "center", "#000", "42");

    let textPositionX = menuPositionX + (menuWidth/2);
    let textPositionY = menuPositionY + (menuHeight/1.5);

    if(loseMenuTextColor === "#000") {
        loseMenuTextColor = "#FFF"
    } else {
        loseMenuTextColor = "#000"
    }

    startAgainText = new Text("Pressione espaço para iniciar novamente.", textPositionX, textPositionY, "center", loseMenuTextColor, "24");
    
    let loseContainer = setInterval(() => {
        loseMenuContainer.Draw();
        gameOverText.Draw();
        startAgainText.Draw();
    })

    if(keys['Space']) {
        init()
        clearInterval(loseContainer)
    } 

}

function gameNormalActionUpdate(){
    context.clearRect(0, 0, canvas.width, canvas.height)

    spawnTimer--;
    spawnObstacle();
    checkObstacles(); 

    dino.Animate();

    updateScore();

    gameSpeed += 0.003;
}

function updateScore() {
    score++;
    scoreText.text = "Score: " + score;
    scoreText.Draw();
    
    if (score > highscore) {
        highscore = score;
        highscoreText.text = "Highscore: " + highscore;
    }

    highscoreText.Draw();
}

function checkObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];

        if (o.x + o.w < 0) {
            o.removeObstacle(i)
        }

        if (dino.x < o.x + o.w && dino.x + dino.w > o.x && dino.y < o.y + o.h && dino.y + dino.h > o.y) {
            loseMenu = true;
            window.localStorage.setItem('highscore', highscore);
        }

        o.Update();
    }
}

function spawnObstacle() {
    if (spawnTimer <= 0) {
        SpawnObstacle();
        spawnTimer = initialSpawnTimer - gameSpeed * 8;
        if (spawnTimer < 60) {
            spawnTimer = 60;

        }
    }
}

function UpdateFrames() {
    requestAnimationFrame(UpdateFrames)
    if(loseMenu) {
        gameLoseUpdate();
    }else {
        gameNormalActionUpdate();
    }
}

function initVariables() {
    loseMenu = false

    initialSpawnTimer = 200;
    spawnTimer = initialSpawnTimer;
    obstacles = []
    gameSpeed = 3;
    gravity = 1;
    score = 0;
    
    highscore = 0;
    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore');
    }
}

function initVisual() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.font = "20px sans-serif";

    dino = new Dino(25, canvas.height - 150, 100, 100);
    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 25,
    25, "right", "#212121", "20");
}

function init() {
    initVariables();
    initVisual();
    UpdateFrames()
}

init();