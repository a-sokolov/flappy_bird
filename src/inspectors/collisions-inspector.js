import { FLOOR_Y_POSITION } from '../constants'

/** Класс для подсчета игровых коллизий */
export class CollisionsInspector {
  constructor(birdController, pipesController) {
    this.birdController = birdController
    this.pipesController = pipesController
  }

  /** Метод для проверки коллизий двух прямоугольников */
  checkRectCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y)
  }

  /** Метод проверки игровых коллизий (когда птичка сталкивается с трубой) */
  isCollision() {
    const { pipes } = this.pipesController
    const { x, y, spriteWidth, spriteHeight } = this.birdController

    return pipes.some(({ top, bottom }) => {
      const birdRect = { x, y, width: spriteWidth, height: spriteHeight }

      return this.checkRectCollision(birdRect, top) || this.checkRectCollision(birdRect, bottom)
    }) || FLOOR_Y_POSITION <= (y + spriteHeight)
  }
}