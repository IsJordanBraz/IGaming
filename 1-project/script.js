window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;


    class Robot {
        constructor(canvas) {
            this.canvas = canvas;
            this.x = this.canvas.width * 0.5;
            this.y = this.canvas.height * 0.5;
            this.radius = 80;
            this.angle = 80;
            this.frameX = 0;
            this.maxFrame = 75;
            this.centerX = this.x;
            this.centerY = this.y;
            this.bodySpriteImage = document.getElementById('sprites');
            this.spriteWidth = 370;
            this.spriteHeight = 393;
            this.eye1Radius = this.radius * 0.4;
            this.eye2Radius = this.radius * 0.64;
            this.eye1Distance = this.eye1Radius;
            this.eye2Distance = this.eye1Radius;
            this.bodyImage = document.getElementById('body');
            this.eye1Image = document.getElementById('eye1');
            this.eye2Image = document.getElementById('eye2');
            this.reflectionImage = document.getElementById('reflection');
            this.lightImage = document.getElementById('light');
            this.movementAngle = 0;
            this.tracking = false;
            this.mouse = {
                x: 0,
                y: 0
            }
            this.canvas.addEventListener('mousemove', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.tracking = true;
            });
            this.canvas.addEventListener('mouseleave', e => {
                this.tracking = false;
            });
        }
        draw(context) {
            //body
            context.drawImage(
                this.bodySpriteImage,
                this.frameX * this.spriteWidth, 
                0, 
                this.spriteWidth, 
                this.spriteHeight,
                this.x - this.bodyImage.width * 0.5 + 65,
                this.y - this.bodyImage.height * 0.5 - 53,
                this.spriteWidth, 
                this.spriteHeight
            );
            //eye1
            context.drawImage(this.eye1Image,
                this.x + Math.cos(this.angle) * this.eye1Radius - this.eye1Image.width * 0.5,
                this.y + Math.sin(this.angle) * this.eye1Radius - this.eye1Image.height * 0.5
            );
            //eye2
            context.drawImage(this.eye2Image,
                this.x + Math.cos(this.angle) * this.eye2Radius - this.eye2Image.width * 0.5,
                this.y + Math.sin(this.angle) * this.eye2Radius - this.eye2Image.height * 0.5
            );
            //reflection
            context.drawImage(
                this.reflectionImage,
                this.x - this.reflectionImage.width * 0.5,
                this.y - this.reflectionImage.height * 0.5
            );
            //light
            if(this.tracking) {
                context.drawImage(
                    this.lightImage,
                    this.x - this.reflectionImage.width * 0.5 + 5,
                    this.y - this.reflectionImage.height * 0.5 - 188,
                );
            }
        }
        update() {
            //angle
            const dx = this.mouse.x - this.x;
            const dy = this.mouse.y - this.y;
            this.angle = Math.atan2(dy, dx);
            const distance = Math.hypot(dx, dy);

            if(distance <= this.eye1Distance * 2.5) {
                this.eye1Radius = distance * 0.4;
                this.eye2Radius = distance * 0.64;
            } 
            // else if (!this.tracking) {
            //     this.eye1Radius = this.eye1Distance;
            //     this.eye2Radius = this.eye2Distance;
            // } else {
            //     this.eye1Radius = this.eye1Distance * Math.cos(this.movementAngle);
            //     this.eye2Radius = this.eye2Distance * Math.cos(this.movementAngle);
            // }
            //sprite animation
            this.frameX >= this.maxFrame ? this.frameX =0 : this.frameX++;
            //movement
            this.movementAngle += 0.02;
            this.y = this.centerY + Math.sin(this.movementAngle) * 50;
        }
    }

    const robot = new Robot(canvas);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        robot.draw(ctx);
        robot.update();
        requestAnimationFrame(animate);
    }
    animate();
});