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
            [
                vec2(4.4, 137.6),
                vec2(4.6, 102.2),
                vec2(5.7, 51.7),
                vec2(18.3, 18.0),
                vec2(50.7, 6.0),
                vec2(78.7, 6.0),
                vec2(104.5, 10.4),
                vec2(132.7, 32.5),
                vec2(146.1, 73.8),
                vec2(135.8, 120.0),
                vec2(120.3, 137.0),
                vec2(93.2, 142.2),
                vec2(46.5, 136.0),
                vec2(28.5, 121.0),
                vec2(27.0, 67.8),
                vec2(50.5, 45.5),
                vec2(46.9, 30.6),
                vec2(35.5, 37.7),
                vec2(24.8, 53.0),
                vec2(22.5, 93.4),
                vec2(23.5, 137.0)
            ],
            [
                vec2(65, 42.9),
                vec2(60, 26.5),
                vec2(71.5, 24.8),
                vec2(81.0, 27.5),
                vec2(97.8, 35.3),
                vec2(118.9, 58.0),
                vec2(120.9, 99.0),
                vec2(108.0, 114.4),
                vec2(89.3, 117.2),
                vec2(68.6, 113.0),
                vec2(42.2, 113.0),
                vec2(40.5, 80.8),
                vec2(53.0, 64.8),
                vec2(55.0, 79.4),
                vec2(48.0, 85.0),
                vec2(51.8, 99.5),
                vec2(59.3, 100.3),
                vec2(82.7, 101.0),
                vec2(107.8, 94.6),
                vec2(105.4, 64.5),
                vec2(91.0, 48.0),
                vec2(75.7, 44.5),
                vec2(66, 42.9)
            ],
            [
                vec2(63.7, 62.0),
                vec2(65.6, 77.7),
                vec2(71.9, 76.5),
                vec2(82.2, 77.0),
                vec2(91.5, 75.7),
                vec2(85.5, 60.2),
                vec2(63.5, 62.3)
            ],
        ],
        "start": vec2(12,129),
        "angle": 3*Math.PI/2,
        "finish": [vec2(52,82), vec2(54, 100)],
        "title": "speed"
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
    {
        "level": [
            vec2(80.6, 124.8),
            vec2(97.2, 142.2),
            vec2(107.8, 141.6),
            vec2(117.3, 131.4),
            vec2(123.5, 114.0),
            vec2(127.7, 128.8),
            vec2(133.8, 136.8),
            vec2(138.8, 141.0),
            vec2(149.4, 140.0),
            vec2(154.5, 136.4),
            vec2(158.4, 122.0),
            vec2(157.7, 101.2),
            vec2(152.3, 78.8),
            vec2(138.0, 66.2),
            vec2(120.8, 67.6),
            vec2(119.4, 56.7),
            vec2(115.7, 46.9),
            vec2(104.0, 44.3),
            vec2(80.4, 59.5),
            vec2(77.0, 56.6),
            vec2(104.7, 40.4),
            vec2(113.0, 40.2),
            vec2(127.5, 53.4),
            vec2(132.0, 59.5),
            vec2(139.9, 62.0),
            vec2(146.0, 65.1),
            vec2(150.8, 66.8),
            vec2(155.5, 64.0),
            vec2(158.0, 53.6),
            vec2(157.6, 36.0),
            vec2(152.0, 18.3),
            vec2(144.5, 8.0),
            vec2(128.4, 2.3),
            vec2(109.8, 0.7),
            vec2(88.4, 2.3),
            vec2(62.5, 15.5),
            vec2(77.5, 29.4),
            vec2(98.0, 19.6),
            vec2(117.7, 18.9),
            vec2(132.2, 26.4),
            vec2(138.5, 39.7),
            vec2(124.6, 23.5),
            vec2(108.9, 20.5),
            vec2(88.7, 28.4),
            vec2(79.7, 35.0),
            vec2(62.0, 46.5),
            vec2(56.3, 59.9),
            vec2(58.7, 71.8),
            vec2(70.7, 81.0),
            vec2(81.3, 78.2),
            vec2(93.0, 70.8),
            vec2(105.0, 64.9),
            vec2(91.6, 75.2),
            vec2(83.0, 88.7),
            vec2(95.7, 100.7),
            vec2(106.8, 89.7),
            vec2(115.2, 85.8),
            vec2(121.0, 82.6),
            vec2(126.7, 85.0),
            vec2(138.7, 97.5),
            vec2(140.5, 113.0),
            vec2(134.5, 98.6),
            vec2(123.1, 90.2),
            vec2(107.6, 97.2),
            vec2(101.6, 109.9),
            vec2(101.0, 118.3),
            vec2(92.4, 105.6),
            vec2(72.0, 87.8),
            vec2(48.5, 73.8),
            vec2(29.9, 68.0),
            vec2(16.3, 80.2),
            vec2(10.0, 102.7),
            vec2(20.0, 117.5),
            vec2(34.2, 131.0),
            vec2(55.0, 138.5),
            vec2(67.0, 122.2),
            vec2(48.7, 112.4),
            vec2(37.0, 101.5),
            vec2(34.2, 92.0),
            vec2(44.0, 94.0),
            vec2(55.2, 104.6),
            vec2(72.0, 114.8),
            vec2(80.6, 124.8)
        ],
        "start": vec2(49,126),
        "angle": 5*Math.PI/4,
        "finish": [vec2(81,27.5), vec2(66, 14)],
        "title": "brain"
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
    let collided = false;
    if (level == 5) {
        for (let i = 0; i < currentLevel.level.length; i++) {
            if (polyCircle(currentLevel.level[i],player.x,player.y,player.radius -2)) {
                collided = true;
                break;
            }
        }
    } else {

        collided = polyCircle(currentLevel.level,player.x,player.y,player.radius -2)
    }
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
            levelSelect.value = level + 1
        }
        restart()
    }

}
function gameDraw() {
    let currentLevel = levels[level];
    // Tutorial
    ctx.save()
    ctx.filter = "blur(3px)";
    ctx.drawImage(tutorial,height-15,0)
    ctx.restore()
    ctx.lineWidth = 0.6
    // level polygon
    ctx.save()
    ctx.shadowColor = "#5C5C5C";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowOffsetX = -5;
    ctx.fillStyle = '#f89f44';
    
    let points = currentLevel.level
    if (level == 3) {
        for (let j = 0; j < points.length; j++) {
            ctx.save()
            ctx.beginPath();
            ctx.moveTo(points[j][0].x, points[j][0].y);
            for (var i = 1; i < points[j].length; i++) {
                ctx.lineTo(points[j][i].x,points[j][i].y)
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke()
            ctx.restore()
        }

    } else {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x,points[i].y)
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke()
        ctx.restore()
    }
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