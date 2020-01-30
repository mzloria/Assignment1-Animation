var AM = new AssetManager();

function Animation(spriteSheet, frameX, frameY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frameX = frameX;
    this.frameY = frameY;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 this.frameX + xindex * this.frameWidth, this.frameY + yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function ColaDrinkLookRight(game, xOffset) {
    this.animation = new Animation(AM.getAsset("./img/colaFlip.png"), 499, 35, -65, 65, 4, 0.10, 4, true, 1);
    this.animationDead = new Animation(AM.getAsset("./img/cola.png"), 0, 341, 70, 65, 5, 0.2, 5, true, 1);
    this.x = 330 + xOffset;
    this.y = 400;
    this.width = 52;
    this.height = 62;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.dead = false;
}

ColaDrinkLookRight.prototype.draw = function () {
    if(!this.dead) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animationDead.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

ColaDrinkLookRight.prototype.update = function () {
}

function ColaDrinkMoveLeft(game) {
    this.animationMoveLeft = new Animation(AM.getAsset("./img/cola.png"), 0, 137, 65, 65, 4, 0.1, 4, true, 1);
    this.x = 1500;
    this.y = 200;
    this.width = 52;
    this.height = 62;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

ColaDrinkMoveLeft.prototype.draw = function () {
    this.animationMoveLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

ColaDrinkMoveLeft.prototype.update = function () {
    if (this.animationMoveLeft.elapsedTime < this.animationMoveLeft.totalTime * 8 /14 ) {
        this.x -= this.game.clockTick * this.speed;
    } 
    if (this.x < -100) this.x = 900;
}

function ColaDrinkMoveRight(game) {
    this.animation = new Animation(AM.getAsset("./img/colaFlip.png"), 499, 137, -65, 65, 4, 0.10, 4, true, 1);
    this.x = -100;
    this.y= 100;
    this.width = 52;
    this.height = 62;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

ColaDrinkMoveRight.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

ColaDrinkMoveRight.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 /14 ) {
        this.x += this.game.clockTick * this.speed;
    } 
    if (this.x > 900) this.x = -200;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && collide(ent, this) && !ent.dead) {
            ent.dead = true;
            this.game.addEntity(new Explosion(this.game));
        }
    } 
}

function ColaDrinkLookLeft(game) {
    this.animation = new Animation(AM.getAsset("./img/cola.png"), 0, 35, 65, 65, 4, 0.10, 4, true, 1);
    this.animationDead = new Animation(AM.getAsset("./img/cola.png"), 0, 341, 70, 65, 5, 0.2, 5, false, 1);
    this.x = 330;
    this.y = 100;
    this.width = 52;
    this.height = 62;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.dead = false;
}

ColaDrinkLookLeft.prototype.draw = function () {
    if(!this.dead) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animationDead.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

ColaDrinkLookLeft.prototype.update = function () {
}

function Explosion(game) {
    this.animation = new Animation(AM.getAsset("./img/explosion.png"),20, 33, 100, 100, 8, 0.1, 48, false, 1);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 200;
    this.x = 310;
    this.y = 90;
}

Explosion.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Explosion.prototype.update = function() {
}

Explosion.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

function Dog(game) {
    this.animationRunning = new Animation(AM.getAsset("./img/dogsprite.png"),201, 10, 95, 58, 8, 0.1, 8, true, 1);
    this.animationJumping = new Animation(AM.getAsset("./img/dogsprite.png"),50, 250, 105, 80, 8, 0.1, 8, true, 1);
   
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 300;
    this.x = -800;
    this.y = 400;
    this.base = 400;
    this.jumpHeight = 100;
    this.jumping = false;
}

Dog.prototype.draw = function() {
    if(!this.jumping) {
        this.animationRunning.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animationJumping.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

Dog.prototype.update = function() {
    if(this.x > 150) {
        this.jumping = true;
    }
    if (this.animationRunning.elapsedTime < this.animationRunning.totalTime * 8 / 14) {
        this.x += this.game.clockTick * this.speed;
    }

    if(this.jumping) {
        var height = 0;
        var duration = this.animationJumping.elapsedTime + this.game.clockTick;
        if (duration > this.animationJumping.totalTime / 2) duration = this.animationJumping.totalTime - duration;
        duration = duration / this.animationJumping.totalTime;
        height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
        this.y = this.base - height;
    } 
    if(this.x > 900 && !this.outside) {
        this.outside = true;
        this.game.addEntity(new Dog(this.game));
    }
}


AM.queueDownload("./img/cola.png");
AM.queueDownload("./img/colaFlip.png");
AM.queueDownload("./img/explosion.png");
AM.queueDownload("./img/dogsprite.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new ColaDrinkLookLeft(gameEngine));
    sleep(500).then(() => {
        gameEngine.addEntity(new ColaDrinkMoveRight(gameEngine));
    })
    sleep(5000).then(() => {
        gameEngine.addEntity(new ColaDrinkMoveLeft(gameEngine));
    })
    gameEngine.addEntity(new ColaDrinkLookRight(gameEngine,0));
    gameEngine.addEntity(new ColaDrinkLookRight(gameEngine,50));
    gameEngine.addEntity(new ColaDrinkLookRight(gameEngine,250));
    gameEngine.addEntity(new ColaDrinkLookRight(gameEngine,300));
    gameEngine.addEntity(new ColaDrinkLookRight(gameEngine,475));
    sleep(9000).then(() => {
        gameEngine.addEntity(new Dog(gameEngine));
    })
});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
