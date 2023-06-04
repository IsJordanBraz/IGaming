export class Game {
  constructor() {

  }

  draw() {
    ctx.drawImage(
      playerImage, 
      frameX, 
      frameY,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    )
    gameFrame++
    requestAnimationFrame(animate)
  }
  
  animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length
    let frameX = spriteWidth * position
    let frameY = spriteAnimations[playerState].loc[position].y
  }
}