/** Спрайт */
export class Sprite {
  constructor({ imageName, sourceX, sourceY, width, height }) {
    this.imageName = imageName
    this.sourceX = sourceX
    this.sourceY = sourceY
    this.width = width
    this.height = height
    this.x = 0
    this.y = 0
    this.angle = 0
  }

  /** Метод установки x и y координат */
  setXY(x, y) {
    this.x = x
    this.y = y
  }

  /** Метод установки угла, на сколько нужно повернуть анимацию */
  setAngle(angle) {
    this.angle = angle
  }
}