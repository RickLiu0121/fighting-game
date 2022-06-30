class Sprite {
    //constructor that an object to be passed in
    //the offset property is used becuase the image have padding for each frame 
    constructor({ position, imgSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;

    }
    draw() {
        //the syntax for cropping 
        c.drawImage(this.image, this.framesCurrent * (this.image.width / this.framesMax), 0, this.image.width / this.framesMax, this.image.height,
            this.position.x - this.offset.x, this.position.y - this.offset.y, (this.image.width / this.framesMax) * this.scale, this.image.height * this.scale)
    }
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold == 0) {
            if (this.framesCurrent < this.framesMax) {
                this.framesCurrent++;
            }
            if (this.framesCurrent == this.framesMax) {
                this.framesCurrent = 0;
            }
        }
    }
    update() {
        this.draw();
        this.animateFrames();
    }

}

//extends keyboard will make sure all established methods from Sprite will be inherited in Fight unless overwritten
//Similar to inheritance idea in C++ 
class Fighter extends Sprite {
    //constructor that an object to be passed in
    constructor({
        position,
        velocity,
        color,
        imgSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined,
        }
    }

    ) {
        //super() calls the parent constructore to set those attributes
        super({ position, imgSrc, scale, framesMax, offset });
        this.position = position;
        this.width = 50;
        this.height = 150
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.position = position;
        this.velocity = velocity;
        //keep track which is the lastKey pressed for each player
        this.lastKey;
        // Assign an object to the attack box
        this.attackBox = {
            //Make another object to accommate the two players
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            //since key and value (passed in thru argument) are the same, shorthand is only have one word
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.offset = offset
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
        this.sprites = sprites;
        this.dead = false;
        for (let sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
        //console.log(this.sprites)

    }
    //method to draw players
    // draw() {
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     if (this.isAttacking) {
    //         c.fillStyle = "Green";
    //         c.fillRect(
    //             this.attackBox.position.x,
    //             this.attackBox.position.y,
    //             this.attackBox.width,
    //             this.attackBox.height
    //         );
    //     }
    // }
    attack() {
        this.switchSprites("attack1");
        this.isAttacking = true;
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 100);
    }

    takeHit() {
        this.health -= 20;
        if (this.health <= 0) {
            console.log("Kenji is dead");
            this.switchSprites("death");
        } else {
            this.switchSprites("takeHit");
        }
    }
    //method to initiate movements of players
    update() {
        this.draw();
        if (!this.dead) {
            this.animateFrames();
        }

        //Make the attackBox move along the body
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        //draw attack box
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)


        //control how the player move horizontally
        //control how the player move vertically
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += GRAVITY;
        }
    }
    switchSprites(sprite) {
        //override other sprites when dead 

        if (this.image == this.sprites.death.image) {
            if (this.framesCurrent == this.sprites.death.framesMax - 1) {
                this.dead = true;
            }
            return;
        }
        //overriding other sprites when attacking 
        if (this.image == this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1)
            return;
        //override other sprites when being attacked
        if (this.image == this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
            return;

        switch (sprite) {
            case "idle":
                if (this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0
                }
                break;
            case "run":
                if (this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "jump":
                if (this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "fall":
                if (this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "attack1":
                if (this.image != this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "takeHit":
                if (this.image != this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case "death":
                if (this.image != this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;

        }

    }
}