import { FLOOR_Y_POSITION } from '../constants'

export class CollisionsInspector {
  constructor(game, birdController, pipesController) {
    this.game = game
    this.birdController = birdController
    this.pipesController = pipesController
  }

  checkRectCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y)
  }

  isCollision() {
    const { pipes } = this.pipesController
    const { x, y, spriteWidth, spriteHeight } = this.birdController

    return pipes.some(({ top, bottom }) => {
      const birdRect = { x, y, width: spriteWidth, height: spriteHeight }

      return this.checkRectCollision(birdRect, top) || this.checkRectCollision(birdRect, bottom)
    }) || FLOOR_Y_POSITION <= (y + spriteHeight)
  }
}