import { ScenePart } from '../../scene-part'
import { ImageType } from '../../interfaces'
import { FLOOR_Y_POSITION } from '../../constants'

export class DrawFloor extends ScenePart {
  constructor(scene) {
    super(scene)

    this.speed = this.scene.game.getSpeed()
  }

  init() {
    super.init()

    this.x = 0

  }

  setX(x) {
    this.x = x
  }

  setSpeed(speed) {
    this.speed = speed
  }

  render(time) {
    super.render(time)

    const { screen } = this.scene.game

    this.x -= this.speed
    screen.drawImage(ImageType.floor, this.x, FLOOR_Y_POSITION)
    if (this.x <= screen.width - screen.getImage(ImageType.floor).width) {
      this.x = 0
    }
  }
}