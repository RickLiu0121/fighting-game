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

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imgSrc: "./img/background.png"
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imgSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6
})
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  //color: "red",
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imgSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imgSrc: "./img/samuraiMack/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },

});
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  //color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imgSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imgSrc: "./img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/kenji/Death.png",
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  }
}
);
console.dir(Sprite); //test purpose


function animate() {
  window.requestAnimationFrame(animate);
  //Because on line 13 - c.fillStyle = "red";
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;


  //Left player movement
  //condition for moving left
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
    //condition for moving right 
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  }//keeps player at idle state when no keys are pressed 
  else {
    player.switchSprites("idle");

  }
  //condition for jumping
  if (player.velocity.y < 0) {
    player.switchSprites("jump")
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall")
  }

  //Right player movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");

  }
  //condition for jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump")
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall")
  }

  //detect for collision from left player 
  if (
    rectangularCollision({
      leftBox: player,
      rightBox: enemy,
    }) &&
    player.isAttacking && player.framesCurrent == 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    // document.querySelector("#rightHealth #remainingHealth").style.width =
    //   enemy.health + "%";

    gsap.to("#rightHealth #remainingHealth", {
      width: enemy.health + "%"
    })
    console.log("Player Attack Successful");
  }
  //if player misses
  if (player.isAttacking && player.framesCurrent == 4) {
    player.isAttacking = false;
  }

  //
  //detect for collision from the right player
  if (
    rectangularCollision({
      leftBox: enemy,
      rightBox: player,
    }) &&
    enemy.isAttacking && enemy.framesCurrent == 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    // document.querySelector("#leftHealth #remainingHealth").style.width =
    //   player.health + "%";
    gsap.to("#leftHealth #remainingHealth", {
      width: player.health + "%"
    })
    console.log("Enemy Attack Successful");
  }
  if (enemy.isAttacking && enemy.framesCurrent == 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }


}
animate();
decreaseTimer();
//using Eventlistener to check for keyboard usage by the user
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
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
    }
    if (!enemy.dead) {
      //Right player keys
      switch (event.key) {
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
    }
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
