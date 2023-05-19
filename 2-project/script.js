window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.font = '40px Helvetica';
    ctx.textAlign = 'center';

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 40;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 70;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight,
                this.spriteX, 
                this.spriteY,
                this.width,
                this.height,
            );

            if(this.game.debug) {
                context.beginPath();
                context.arc(
                    this.collisionX,
                    this.collisionY, 
                    this.collisionRadius,
                     0, Math.PI * 2
                );
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }            
        }
        update() {

        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 55;
            this.speedX = 0;
            this.speedY - 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
            this.spriteWidth = 255;
            this.spriteHeight = 256;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = 0;
            this.image = document.getElementById('bull');
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY - 30,
                this.width,
                this.height
            );
            if(this.game.debug) {
                context.beginPath();
                context.arc(
                    this.collisionX,
                    this.collisionY, 
                    this.collisionRadius,
                     0, Math.PI * 2
                );
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();    
                context.beginPath();
                context.moveTo(this.collisionX, this.collisionY);
                context.lineTo(this.game.mouse.x, this.game.mouse.y);
                context.stroke();
            }
           
        }
        update() {
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;

            const angle = Math.atan2(this.dy, this.dx);
            if (angle < -2.74 || angle > 2.74) this.frameY = 6;
            else if (angle < -1.96) this.frameY = 7;
            else if(angle< -1.17) this.frameY = 0;
            else if (angle < -0.39) this.frameY = 1;
            else if (angle < 0.39) this.frameY = 2;
            else if (angle < 1.17) this.frameY = 3;
            else if (angle < 1.96) this.frameY = 4;
            else if (angle < 2.74) this.frameY = 5;

            const distance = Math.hypot(this.dy, this.dx);

            if (distance > this.speedModifier) {
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;
            //horizontal boundaries
            if (this.collisionX < 0 + this.collisionRadius)
                this.collisionX = 0 + this.collisionRadius;
            else if (this.collisionX > this.game.width - this.collisionRadius)
                this.collisionX = this.game.width - this.collisionRadius;
            //horizontal boundaries
            if (this.collisionY < this.game.topMargin + this.collisionRadius)
                this.collisionY = this.collisionRadius + this.game.topMargin;
            else if (this.collisionY > this.game.height - this.collisionRadius)
                this.collisionY = this.game.height - this.collisionRadius;           
            //collisions with obstacles
            this.game.obstacles.forEach(obstacle => {
                let [collision, distance, sumOfRadius, dx, dy] = this.game.checkCollision(this, obstacle)
                if(collision) {
                    const unit_x = dx/distance;
                    const unit_y = dy / distance
                    this.collisionX = obstacle.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY = obstacle.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
        }
    }

    class Egg {
        constructor(game) {
            this.game = game;
            this.collisionRadius = 40;
            this.margin = this.collisionRadius * 2;
            this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin));
            this.image = document.getElementById('egg');
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 5000;
            this.markToDelete = false;
        }
        draw(context) {
            context.drawImage(this.image, this.spriteX, this.spriteY);
            if(this.game.debug) {
                context.beginPath();
                context.arc(
                    this.collisionX,
                    this.collisionY, 
                    this.collisionRadius,
                     0, Math.PI * 2
                );
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
                context.fillText(displayTimer, this.collisionX, this.collisionY - this.collisionRadius * 2.5);
            } 
        }
        update(deltaTime) {
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 28;
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadius, dx, dy] = this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
            if(this.hatchTimer > this.hatchInterval) {
                this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY))
                this.markToDelete = true;
                this.game.removeGameObjects();
            } else {
                this.hatchTimer += deltaTime;
            }
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('enemy');
            this.collisionRadius = 55;
            this.speedX = Math.random() * 3 + 5;
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
            
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.spriteX,
                this.spriteY
            );
        }
        update() {
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height + 40;
            this.collisionX -= this.speedX;
            if(this.spriteX + this.width < 0) {
                this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
                this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
            }
            let collisionObjects = [this.game.player, ...this.game.obstacles];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadius, dx, dy] = this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
        }
    }

    class Larva {
        constructor(game, x, y) {
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 30;
            this.image = document.getElementById('larva');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width  = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.speedY = 1 + Math.random();
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 2);
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            if(this.game.debug) {
                context.beginPath();
                context.arc(
                    this.collisionX,
                    this.collisionY, 
                    this.collisionRadius,
                     0, Math.PI * 2
                );
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        update() {
            this.collisionY -= this.speedY;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 50;

            //move to safety
            if(this.collisionY < this.game.topMargin) {
                this.markToDelete = true;
                this.game.removeGameObjects();
                this.game.score++;
            }
            // collision
            let collisionObjects = [
                this.game.player, 
                ...this.game.obstacles,
            ];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadius, dx, dy] = this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
            // collision enimies
            this.game.enemies.forEach(enemy => {
                if(this.game.checkCollision(this, enemy)[0]) {
                    this.markToDelete = true;
                    this.game.removeGameObjects();
                    this.game.lostHatchlings++;
                }
            });
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;            
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.numberOfObstacles = 10;
            this.debug = true;
            this.obstacles = [];
            this.topMargin = 260;
            this.fps = 60;
            this.timer = 0;
            this.interval = (1000 / this.fps);
            this.maxEggs = 10;
            this.eggTimer = 0;
            this.eggInterval = 100;
            this.eggs = [];
            this.enemies = [];
            this.gameObjects = [];
            this.hatchlings = [];
            this.score = 0;
            this.lostHatchlings = 0;
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', e => {
                if(this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }                
            });
            window.addEventListener('keydown', e => {
                if(e.key == 'd') this.debug = !this.debug;
            });
        }
        render(context, deltaTime){
            if(this.timer > this.interval) {
                ctx.clearRect(0, 0, this.width, this.height);
                this.gameObjects = [
                    ...this.eggs, 
                    ...this.obstacles,
                    ...this.enemies,
                    ...this.hatchlings,
                    this.player
                ];
                //sort vertical positions
                this.gameObjects.sort((a, b) => {
                    return a.collisionY - b.collisionY;
                });
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                })
                this.player.draw(context); 
                this.player.update();
                this.time = 0;
            }
            this.timer += deltaTime;
            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime;
            }
            
            context.save();
            context.textAlign = 'left';
            context.fillText('Score: ' + this.score, 25, 50);
            if(this.debug) {
                context.fillText('Lost: ' + this.lostHatchlings, 25, 100);
            }                
            context.restore();
        }

        removeGameObjects() {
            this.eggs = this.eggs.filter(object => !object.markToDelete);
            this.hatchlings = this.hatchlings.filter(object => !object.markToDelete);
        }

        checkCollision(a, b) {
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadius = a.collisionRadius + b.collisionRadius;
            return [(distance < sumOfRadius), distance, sumOfRadius, dx, dy];
        }

        addEgg() {
            this.eggs.push(new Egg(this));
        }
        addEnemy() {
            this.enemies.push(new Enemy(this));
        }

        init() {
            for(let i = 0; i < 3; i++) {
                this.addEnemy();
            }
            let attempts = 0;
            while(this.obstacles.length < this.numberOfObstacles && attempts < 200) {
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 100;
                    const sumOfRadius = distanceBuffer + testObstacle.collisionRadius + obstacle.collisionRadius;
                    if (distance < sumOfRadius) {
                        overlap = true;
                    }
                });

                const margin = testObstacle.collisionRadius * 3;
                if(!overlap && 
                    testObstacle.spriteX > 0 && 
                    testObstacle.spriteX < this.width - testObstacle.width &&
                    testObstacle.collisionY > this.topMargin + margin &&
                    testObstacle.collisionY < this.height - margin) {
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);    
    game.init();

    let lastime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastime;
        lastime = timestamp;
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});