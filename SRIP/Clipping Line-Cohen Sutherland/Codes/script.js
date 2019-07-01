"use strict";

class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    static random() {
        var random = function(min, max) {
            return Math.floor(min + Math.random() * (max - min));
        }

        var x = random(0.0, window.innerWidth);
        var y = random(0.0, window.innerHeight);

        var vx = random(-5.0, 5.0);
        var vy = random(-5.0, 5.0);

        return new Particle(x, y, vx, vy);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) {
            this.vx *= -1;
        }
        if (this.y < 0) {
            this.vy *= -1;
        }
        if (this.x > window.innerWidth) {
            this.vx *= -1;
        }
        if (this.y > window.innerHeight) {
            this.vy *= -1;
        }
    }
}

function getFactor() {
    var isRetina = (window.devicePixelRatio > 1);

    var isIOS = ((ctx.webkitBackingStorePixelRatio < 2) || (ctx.webkitBackingStorePixelRatio == undefined));

    if (isRetina && isIOS) {
        return 2;	
    } else {
        return 1;
    }
}

function createRandomLines(numberOfLines) {
    var lines = [];

    for(var i = 0; i < numberOfLines; i++) {
        var a = Particle.random();
        var b = Particle.random();

        lines.push([a, b]);
    }

    return lines;
}

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var factor = getFactor();

var lines = createRandomLines(10);

var frame_width = 500.;
var frame_height = 500.;

function loop() {
    clear();
    draw();
    update();
    queue();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    canvas.width = window.innerWidth * factor;
    canvas.height = window.innerHeight * factor;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(factor, factor);

    var frame_left = (window.innerWidth - frame_width) * 0.5;
    var frame_right = (window.innerWidth + frame_width) * 0.5;
    var frame_top = (window.innerHeight - frame_height) * 0.5;
    var frame_bottom = (window.innerHeight + frame_height) * 0.5;

    ctx.save();
    ctx.shadowBlur=30;
    ctx.shadowColor="rgb(190,190,190)";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(frame_left, frame_top, frame_width, frame_height);
    ctx.fill();
    ctx.restore();

    var clipper = new Clipper(Point(frame_left, frame_top),
        Point(frame_right, frame_bottom));

    for (var i = 0; i < lines.length; i++) {
        var [a, b] = lines[i]

        ctx.save();
        ctx.strokeStyle="rgb(180,180,180)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();

        var [result, a, b] = clipper.clipLine(a, b);

        if (result < 0) {
            continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
    }
}

function update() {
    for (var i = 0; i < lines.length; i++) {
        var [a, b] = lines[i]
        a.update();
        b.update();
    }
}

function queue() {
    window.requestAnimationFrame(loop);
}

loop();