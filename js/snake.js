let canvas = document.getElementById("snakeGame"),
cw = canvas.width,
ch = canvas.height,
ctx = null,
fps = 15,
gameover = false;

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;
        this.color = "red";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class SnakePart {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;
        this.color = color;
        this.dir = "right";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

const apple = new Apple(50, 50);

let snakeArray;
snakeArray = [];
snakeArray.push(new SnakePart(20, 0, "green"));
snakeArray.push(new SnakePart(30, 0, "green"));
snakeArray.push(new SnakePart(40, 0, "green"));

const retryGameButton = document.getElementById("retryGameButton");
retryGameButton.addEventListener("click", () => {
    gameover = false;
    window.counter = 0;

    snakeArray = [];
    snakeArray.push(new SnakePart(20, 0, "green"));
    snakeArray.push(new SnakePart(30, 0, "green"));
    snakeArray.push(new SnakePart(40, 0, "green"));
});

window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch(event.key) {
        case "ArrowRight":
        case "d":
            if(snakeArray[0].dir !== "left") {
                snakeArray[0].dir = "right";
            }
            break;

        case "ArrowLeft":
        case "a":
            if(snakeArray[0].dir !== "right") {
                snakeArray[0].dir = "left";
            }
            break;
        case "ArrowDown":
        case "s":
            if(snakeArray[0].dir !== "up") {
                snakeArray[0].dir = "down";
            }
            break;
        case "ArrowUp":
        case "w":
            if(snakeArray[0].dir !== "down") {
                snakeArray[0].dir = "up";
            }
            break;
    }
});

//THIS GAME IS DONE JUST NEED TO IMPLEMENT GAMEOVER MORE AND ADD SCORE!!!!

function checkAppleCollision(snakeHead, apple) {
    if(snakeHead.x === apple.x && snakeHead.y === apple.y) {
        let newSnakePart;
        if(snakeHead.dir === "right") {
            const newX = snakeArray[snakeArray.length - 1].x - 10;
            const newY = snakeArray[snakeArray.length - 1].y;

            newSnakePart = new SnakePart(newX, newY, "green");
        } else if(snakeHead.dir === "left") {
            const newX = snakeArray[snakeArray.length - 1].x + 10;
            const newY = snakeArray[snakeArray.length - 1].y;

            newSnakePart = new SnakePart(newX, newY, "green");
        } else if(snakeHead.dir === "down") {
            const newX = snakeArray[snakeArray.length - 1].x;
            const newY = snakeArray[snakeArray.length - 1].y - 10;

            newSnakePart = new SnakePart(newX, newY, "green");
        } else if(snakeHead.dir === "up") {
            const newX = snakeArray[snakeArray.length - 1].x;
            const newY = snakeArray[snakeArray.length - 1].y + 10;

            newSnakePart = new SnakePart(newX, newY, "green");
        }
        snakeArray.push(newSnakePart);

        function changeApplePosition() {
            apple.x = getRandomInt(0, 59) * 10;
            apple.y = getRandomInt(0, 39) * 10;

            for(let i = 1; i < snakeArray.length; i++) {
                if(apple.x === snakeArray[i].x && apple.y === snakeArray[i].y) {
                    changeApplePosition();
                }
            }
        }

        changeApplePosition();
    }
}

//I couldnt find a bug that caused a collision when the snake was spawned so I made this counter to ignore the first time
//the "collision" happens
window.counter = 0;
function checkDeathCollision(snakeHead, snakePart) {
    if(snakeHead.x == snakePart.x && snakeHead.y == snakePart.y) {
        if(window.counter === 0) {
            window.counter++;
        } else {
            gameover = true;
            //console.log("inside 1st thing");
        }
    } 

    if(snakeHead.x < 0) {
        gameover = true;
        //console.log("inside 5 thing");
    } else if(snakeHead.y < 0) {
        gameover = true;
        //console.log("inside 6 thing");
    } else if(snakeHead.y + 10 > ch) {
        gameover = true;
        //console.log("inside 7 thing");
    } else if(snakeHead.x + 10 > cw) {
        gameover = true;
        //console.log("inside 8 thing");
    }
}

function moveSnake(snakeArray) {
    const head = snakeArray[0];
    const tail = snakeArray.pop();
    tail.dir = head.dir;
    if(head.dir === "right") {
        tail.x = head.x + 10;
        tail.y = head.y;
    } else if(head.dir === "left") {
        tail.x = head.x - 10;
        tail.y = head.y;
    } else if(head.dir === "down") {
        tail.y = head.y + 10;
        tail.x = head.x;
    } else if(head.dir === "up") {
        tail.y = head.y - 10;
        tail.x = head.x;
    }
    snakeArray.unshift(tail);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const gameText = document.getElementById("gameText");

function gameLoop() {
    if(gameover) {
        //console.log("GAME IS OVER");
        gameText.innerHTML = "GAME OVER!"
    } else {
        ctx.clearRect(0, 0, cw, ch);
        
        ctx.beginPath();

        moveSnake(snakeArray);

        for(let i = 0; i < snakeArray.length; i++) {
            snakeArray[i].draw(ctx);
            
            if(i >= 1) {
                checkDeathCollision(snakeArray[0], snakeArray[i]);
            }
        }

        apple.draw(ctx);
        checkAppleCollision(snakeArray[0], apple);

        gameText.innerHTML = "Score is: " + (snakeArray.length - 3) * 10;
    }
}

if(typeof (canvas.getContext) !== undefined) {
    ctx = canvas.getContext("2d");

    setInterval(gameLoop, 1000 / fps);
}
