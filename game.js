const canvas = document.createElement("canvas");
canvas.style.backgroundColor = "lightgrey"
canvas.width = 300;
canvas.height = 300;
document.body.appendChild(canvas);
const context = canvas.getContext("2d");

function draw(coordinateX, coordinateY, color) {
    const ctx = context;
    ctx.fillStyle = color;
    ctx.fillRect(coordinateX, coordinateY, 20, 20);
}

const spriteWidth = 16;
const spriteHeight = 18;
const frameLoop = [0, 1, 0, 2];

function drawSprite(img, spriteX, spriteY, coordinateX, coordinateY) {
    const ctx = context;
    ctx.drawImage(img, spriteWidth * spriteX, spriteHeight * spriteY, spriteWidth, spriteHeight, coordinateX, coordinateY, 20, 20);
}

context.clearRect(0, 0, canvas.width, canvas.height)

function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    playerCharacter.update();
    gamePieces.update();
}

const playerCharacter = {
    x: 0,
    y: 0,
    img: "",
    xVelocity: 0,
    yVelocity: 0,
    color: "red",
    facingDirection: 0,
    currentFrame: 0,
    hasMoved: false,
    key: "",

    start: function () {
        this.img = new Image();
        this.img.src = document.getElementById("spritesheet2").src;
    },

    update: function () {
        this.updateVelocity();
        this.key = "";

        if (!(this.x === 0 && this.xVelocity < 0) && !(this.x === canvas.width - 20 && this.xVelocity > 0)) {
            this.x += this.xVelocity * 20;
        }

        if (!(this.y === 0 && this.yVelocity < 0) && !(this.y === canvas.width - 20 && this.yVelocity > 0)) {
            this.y += this.yVelocity * 20;
        }

        if (this.hasMoved === true) {
            this.currentFrame++;
            if (this.currentFrame >= frameLoop.length) {
                this.currentFrame = 0;
            }
        }

        this.xVelocity = 0;
        this.yVelocity = 0;
        // draw(this.x, this.y, this.color)
        drawSprite(this.img, frameLoop[this.currentFrame], this.facingDirection, this.x, this.y);
    },

    updateVelocity: function () {
        switch (this.key) {
            case "w":
                this.yVelocity = -1;
                this.facingDirection = 1;
                this.hasMoved = true;
                break;
            case "s":
                this.yVelocity = 1;
                this.facingDirection = 0;
                this.hasMoved = true;
                break;
            case "a":
                this.xVelocity = -1;
                this.facingDirection = 2;
                this.hasMoved = true;
                break;
            case "d":
                this.xVelocity = 1;
                this.facingDirection = 3;
                this.hasMoved = true;
                break;
            default:
                this.facingDirection = 0;
                this.currentFrame = 0;
                this.hasMoved = false;
        }
    },
}

class GamePiece {
    constructor() {
        this.x = Math.floor(Math.random() * (canvas.width - 20));
        this.y = 0;
        this.color = "black";
    }
}

const gamePieces = {
    storage: [],
    create: function () {
        const gamePiece = new GamePiece();
        draw(gamePiece.x, gamePiece.y, gamePiece.color);
        this.storage.push(gamePiece);
    },
    update: function () {
        this.storage.forEach(gamePiece => {
            gamePiece.y += 20;
            if (gamePiece.y > canvas.width) {
                this.storage.shift();
            }
        })
        this.drawGamePieces();
        if (this.storage.length < 5) {
            this.create();
        }
        this.checkCollission();
    },
    drawGamePieces: function () {
        this.storage.forEach(gamePiece => {
            draw(gamePiece.x, gamePiece.y, gamePiece.color);
        })
    },
    checkCollission: function () {
        this.storage.forEach(gamePiece => {
            if (gamePiece.y === playerCharacter.y) {
                //korrektur pC-20
                if (!(gamePiece.x < playerCharacter.x - 20 || gamePiece.x > (playerCharacter.x + 20))) {
                    clearInterval(gameInterval);
                }
            }
        })
    }
}



window.addEventListener("keydown", function (event) {

    playerCharacter.key = event.key;

    /* if (event.key === "w") {
         playerCharacter.yVelocity = -1;
         playerCharacter.facingDirection = 1;
         playerCharacter.hasMoved = true;
         return;
     }
     if (event.key === "s") {
         playerCharacter.yVelocity = 1;
         playerCharacter.facingDirection = 0;
         playerCharacter.hasMoved = true;
         return;
     }
     if (event.key === "a") {
         playerCharacter.xVelocity = -1;
         playerCharacter.facingDirection = 2;
         playerCharacter.hasMoved = true;
         return;
     }
     if (event.key === "d") {
         playerCharacter.xVelocity = 1;
         playerCharacter.facingDirection = 3;
         playerCharacter.hasMoved = true;
         return;
     } */
});

window.addEventListener("keyup", function (event) {
    playerCharacter.key = "";
});


playerCharacter.start();
let gameInterval = setInterval(updateGame, 200)
