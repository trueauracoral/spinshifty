import { loadImage, polyCircle, lineCircle, linePoint, pointCircle, drawPixelText, vec2 } from "./globals.js";

const canvas = document.getElementById('canvas');

export const ctx = canvas.getContext('2d');
let scalingFactor = 4;
canvas.width =160 * scalingFactor;
canvas.height = 144 * scalingFactor;
ctx.scale(scalingFactor, scalingFactor);

let width = canvas.width / scalingFactor
let height = canvas.height / scalingFactor
const halfWidth = width / 2;
const halfHeight = height / 2;

ctx.imageSmoothingEnabled= false

let tutorial = loadImage("./images/tutorial2.png")

let levelSelect = document.getElementById("number");
levelSelect.defaultValue = "1";
levelSelect.dispatchEvent(new Event('input'));

class Ball {
    constructor() {
        this.x = 0.0;
        this.y = 0.0;
        this.vx = 0.0;
        this.vy = 0.0;
        this.ax = 0.0;
        this.ay = 0.0;
        this.angle = 0;
        this.radius = 0.0
        this.id = 0;
        this.hitCooldown = 0;
        this.speed = 5;
    }
}

let player = new Ball()
player.radius = 5
let lastPush = vec2(0,0)
var levels = [
    {
        "level": [
            vec2(141,99),
            vec2(39,99),
            vec2(39,95),
            vec2(141,95),
            vec2(141,43),
            vec2(21,43),
            vec2(21,62),
            vec2(116,60),
            vec2(116,70),
            vec2(20,70),
            vec2(20,119),
            vec2(107,119),
            vec2(110,140),
            vec2(140,140),
        ],
        "start": vec2(124,126),
        "angle": 3*Math.PI/2,
        "finish": [vec2(34,61.6), vec2(34, 43)],
        "title": "zigzag"
    },
    {
        "level": [
            vec2(135,134),
            vec2(113,134),
            vec2(109,55),
            vec2(94,55),
            vec2(93,133),
            vec2(60,133),
            vec2(60,133),
            vec2(60,57),
            vec2(60,57),
            vec2(34,57),
            vec2(34,133),
            vec2(6,133),
            vec2(6,109),
            vec2(17,109),
            vec2(17,109),
            vec2(17,30),
            vec2(77,30),
            vec2(77,115),
            vec2(79,115),
            vec2(79,30),
            vec2(135,30),
            
        ],
        "start": vec2(124,126),
        "angle": 3*Math.PI/2,
        "finish": [vec2(11,109), vec2(11, 133)],
        "title": "narrow pipes"
    },
    {
        "level": [
            vec2(74.2, 82.3),
            vec2(52.5, 66.8),
            vec2(82.6, 40.6),
            vec2(109.4, 52.9),
            vec2(82.7, 2.2),
            vec2(54.8, 46.7),
            vec2(9.2, 64.2),
            vec2(52, 85.8),
            vec2(18.3, 136.2),
            vec2(77, 122),
            vec2(143.6, 136),
            vec2(115.6, 85.2),
            vec2(156.3, 66.2),
            vec2(112, 58.2),
            vec2(94.6, 83.9),
            vec2(103, 108.4),
            vec2(77.4, 94),
            vec2(55.1, 111.6)
        ],
        "start": vec2(130,69),
        "angle": 4.5*Math.PI/5,
        "finish": [vec2(98,48), vec2(104, 42)],
        "title": "star"
    },
    {
        "level": [
            vec2(70,100),
            vec2(70,133),
            vec2(47,131),
            vec2(27,117),
            vec2(42,102),
            vec2(24,113),
            vec2(15,82),
            vec2(15,52),
            vec2(25,32),
            vec2(42,20),
            vec2(54,38), // spike
            vec2(49,18),
            vec2(67,14),
            vec2(89,15),
            vec2(112,20),
            vec2(126,30),
            vec2(116,44),
            vec2(129,36),
            vec2(134,53),
            vec2(137,72),
            vec2(134,92),
            vec2(123,114),
            vec2(107,104),
            vec2(120,116),
            vec2(106,128),
            vec2(83,132), //end
            vec2(83,102),
            vec2(93,95),
            vec2(102,82),
            vec2(119,84), // spike
            vec2(106,78),
            vec2(101,61),
            vec2(91,53),
            vec2(87,30), // spike
            vec2(83,52),
            vec2(66,53),
            vec2(54,58),
            vec2(51,69),
            vec2(33,77), // spike
            vec2(52,74),
            vec2(55,87),
            
        ],
        "start": vec2(57,114),
        "angle": Math.PI,
        "finish": [vec2(86,100), vec2(86, 131.5)],
        "title": "donut"
    },

]
let level = 0;

levelSelect.setAttribute("max", levels.length)

function restart() {
    player.x = levels[level].start.x
    player.y = levels[level].start.y
    player.angle = levels[level].angle
    lastPush = vec2(0,0)
}
// Source - https://stackoverflow.com/a/77478172
// Posted by Nom
// Retrieved 2026-06-23, License - CC BY-SA 4.0
levelSelect.addEventListener('input', function() {
    level = this.value - 1
    restart()
  });

restart()
let dt;

  const keys = {
    //ArrowUp: false,
    //ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space:false,
    ShiftLeft: false,
    ShiftRight: false,
    KeyA: false,
    KeyC: false,
    KeyD: false,
    KeyE: false,
    KeyF: false,
    KeyI: false,
    KeyJ: false,
    KeyL: false,
    KeyW: false,
    KeyS: false,
    KeyQ: false,
    KeyX: false,
    KeyZ: false,
};

window.addEventListener("keydown", (e) => {
    if ((e.code === "ArrowUp" || e.code === "ArrowDown") && !e.repeat) {
        lastPush = vec2(
            Math.cos(player.angle) * player.radius,
            Math.sin(player.angle) * player.radius
        );
    }
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

function gameUpdate() {
    //console.log(level)
    let currentLevel = levels[level];
    // Turn
    let turnForce = 5
    if (keys.ArrowLeft) {
        player.angle -= turnForce*dt
    }
    if (keys.ArrowRight) {
        player.angle += turnForce * dt
    }
    // push
    // if (keys.ArrowUp) {
    //     //console.log(lastPush)
    //     lastPush = vec2(Math.cos(player.angle)*player.radius, Math.sin(player.angle)*player.radius)
    //     pressedUp = true;
    // }
    
    player.x += player.speed * lastPush.x * dt
    player.y += player.speed * lastPush.y * dt
    // Collide
    let collided = polyCircle(levels[level].level,player.x,player.y,player.radius -2)
    //drawPixelText(collided, 0, 0)
    if (collided) {
        let currentLevel = levels[level]
        let startPos = currentLevel.start;
        player.x = startPos.x
        player.y = startPos.y
        let levelangle = currentLevel.angle
        player.angle = levelangle
        lastPush = vec2(0,0)
    }
    let finishedLine = currentLevel.finish
    let finished = lineCircle(finishedLine[0].x,finishedLine[0].y,
                              finishedLine[1].x,finishedLine[1].y,
                              player.x, player.y, player.radius)
    //drawPixelText(finished, 0, 10)
    if (finished) {
        if (level + 1 < levels.length) {
            level+=1
        }
        restart()
    }

}
function gameDraw() {
    let currentLevel = levels[level];
    ctx.lineWidth = 0.6
    // level polygon
    ctx.save()
    ctx.shadowColor = "#5C5C5C";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowOffsetX = -5;
    ctx.fillStyle = '#f89f44';
    
    ctx.beginPath();
    let points = currentLevel.level
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x,points[i].y)
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke()
    ctx.restore()

    // player
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill()
    ctx.beginPath(); // Start a new path
    ctx.moveTo(player.x, player.y); // Move the pen to (30, 50)
    ctx.lineTo(player.x+Math.cos(player.angle)*player.radius, player.y+Math.sin(player.angle)*player.radius); // Draw a line to (150, 100)
    ctx.closePath()
    // player direction arrow
    let triangleLength = 1.7
    let triangleWidth = 2
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    let basePoint = vec2(player.x + (player.radius + 1)*Math.cos(player.angle),player.y+ (player.radius + 1) * Math.sin(player.angle))
    ctx.lineTo(basePoint.x + triangleWidth*Math.cos(player.angle + Math.PI/2), basePoint.y+triangleWidth*Math.sin(player.angle + Math.PI/2))
    ctx.lineTo(player.x + triangleLength * (player.radius + 1)*Math.cos(player.angle), player.y+ triangleLength*(player.radius + 1) * Math.sin(player.angle))
    ctx.lineTo(basePoint.x - triangleWidth*Math.cos(player.angle + Math.PI/2), basePoint.y-triangleWidth*Math.sin(player.angle + Math.PI/2))
    ctx.closePath()
    ctx.fill()

    // finish line
    ctx.lineWidth = 1
    ctx.strokeStyle = "white"
    let finishPoints = currentLevel.finish;
    let firstFinish = finishPoints[0]
    let secondFinish = finishPoints[1]
    ctx.beginPath()
    ctx.moveTo(firstFinish.x,firstFinish.y)
    ctx.lineTo(secondFinish.x,secondFinish.y)
    ctx.closePath()
    ctx.stroke()

    // Level name
    drawPixelText(`level ${level+1}/${levels.length}: ${currentLevel.title}`, 2,2,false,"white")
    // Tutorial
    ctx.save()
    ctx.filter = "blur(3px)";
    ctx.drawImage(tutorial,height-15,0)
    ctx.restore()
}
let lastTime = performance.now();
function gameLoop() {
    let now = performance.now();
    dt = (now - lastTime) / 1000;
    //console.log(now-lastTime)
    lastTime = now;
    if (dt > 0.05) {
        dt = 0.05;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);
    
    gameUpdate();
    gameDraw()
}

gameLoop();

document.addEventListener('pointerdown', e => {
    console.log(getMousePosition(canvas, e));

});

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / scalingFactor);
    let y = Math.floor((event.clientY - rect.top) / scalingFactor);
    return {x: x, y: y};
}