//use canvas as the playground
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//Set playground size
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

//Set key control for players
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};
//acceleration to mimic real life scenario
//Since it's a small number it also helps to reduce the gap to the bottom
const GRAVITY = 0.7;
class Sprite {
  //constructor that an object to be passed in
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    //keep track which is the lastKey pressed for each player
    this.lastKey;
    //Assign an object to the attack box
    this.attackBox = {
      //Make another object to accommate the two players
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      //since key and value (passed in thru argument) are the same, shorthand is only have one word
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }
  //method to draw players
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      c.fillStyle = "Green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  //method to initiate movements of players
  update() {
    this.draw();
    //Make the attackBox move along the body
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //control how the player move horizontally
    //control how the player move vertically
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }
  }
}
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
});
const enemy = new Sprite({
  position: {
    x: 800,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});
console.dir(Sprite); //test purpose

function rectangularCollision({ leftBox, rightBox }) {
  //console.log(  `leftplayer: ${leftBox.attackBox.position.x + leftBox.attackBox.width}`);
  //console.log(`Rightplayer: ${rightBox.position.x} `);
  let isColliding =
    leftBox.attackBox.position.x + leftBox.attackBox.width >=
      rightBox.position.x &&
    leftBox.attackBox.position.x <= rightBox.position.x + rightBox.width &&
    leftBox.attackBox.position.y + leftBox.attackBox.height >=
      rightBox.position.y &&
    leftBox.attackBox.position.y <= rightBox.position.y + rightBox.height;
  //console.log(isColliding);
  return isColliding;
}
function animate() {
  window.requestAnimationFrame(animate);
  //Because on line 13 - c.fillStyle = "red";
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Left player movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
  }

  //Right player movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect for collision from left player
  if (
    rectangularCollision({
      leftBox: player,
      rightBox: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#rightHealth #remainingHealth").style.width =
      enemy.health + "%";
    console.log("Player Attack Successful");
  }
  //detect for collision from the right player
  if (
    rectangularCollision({
      leftBox: enemy,
      rightBox: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#leftHealth #remainingHealth").style.width =
      player.health + "%";
    console.log("Enemy Attack Successful");
  }
}
animate();

//using Eventlistener to check for keyboard usage by the user
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //Left player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
    //Right player keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
window.addEventListener("keyup", (event) => {
  //Left player keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    //Right player keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
