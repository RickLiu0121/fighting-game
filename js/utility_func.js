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

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    let banner = document.querySelector("#announceWinner");
    banner.style.display = "flex"
    if (player.health > enemy.health) {
        banner.innerHTML = "LEFT WON"
    }
    else if (player.health < enemy.health) {
        banner.innerHTML = "RIGHT WON"
    }
    else {
        banner.innerHTML = "TIE"
    }
}
let timer = 61;// will need to query select from html template
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        //setTimeout() returns task id so it can be identifiable 
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector("#timer").innerHTML = timer;

    }
    if (timer == 0) {
        determineWinner({ player, enemy, timerId });
    }
}