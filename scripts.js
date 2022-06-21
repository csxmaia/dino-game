let score = document.querySelector("#score");


let interval = null;
let playerScore = 0;

let scoreCounter = () => {
  playerScore++;
  score.innerHTML = `Score <b>${playerScore}</b>`;
}

window.addEventListener("keydown", function (event){
  if (event.keyCode === 38){
    gameOver.style.display = "none";

    let playerScore = 0;
    interval = setInterval(scoreCounter, 200);
  }
})

////////////////////////////////////////////////////////////////////////////////
class Cactus {
  cactusElement = document.getElementById("cactus");
  xSize = 50;
  ySize = 50;
}

class Dino {
  isSquat = false;
  dinoElement = document.getElementById("dino");
  position = 160;

  jumpUp() {
    if (!this.dinoElement.classList.contains("jump")) {
      this.dinoElement.classList.add("jump");
  
      let that = this;
      setTimeout(function () {
        that.dinoElement.classList.remove("jump");
      }, 600);
    }
  }
  
  //agachar action
  squatDown() {
    if(!this.isSquat && !this.dinoElement.classList.contains("squat")) {
      this.dinoElement.classList.add("squat");
      this.isSquat = true;
    }
  }

  //levantar agachamento action
  squatUp() {
    if (this.isSquat && this.dinoElement.classList.contains("squat")) {
      this.dinoElement.classList.remove("squat");
      this.isSquat = false;
    }
  }
}

let dino = new Dino();
let cactus = new Cactus();

let isAlive = setInterval(function () {
  let dinoTop = parseInt(window.getComputedStyle(dino.dinoElement).getPropertyValue("top"));
  let cactusLeft = parseInt(window.getComputedStyle(cactus.cactusElement).getPropertyValue("left"));

  console.log(dino.isSquat)

  if (cactusLeft < cactus.xSize && cactusLeft > 0 && dinoTop >= dino.position-cactus.ySize) {
    console.log("123")
  }
}, 10);

document.addEventListener("keydown", function (event) {
  if(event.keyCode === 38) {
    dino.jumpUp();
  }
  if(event.keyCode === 40) {
    dino.squatDown();
  }
});

document.addEventListener("keyup", function (event) {
  if(event.keyCode === 40 && dino.isSquat) {
    dino.squatUp();
  }
});
