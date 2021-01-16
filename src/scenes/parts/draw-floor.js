import { ScenePart } from '../../scene-part'
import { ImageType } from '../../interfaces'
import { FLOOR_Y_POSITION } from '../../constants'

export class DrawFloor extends ScenePart {
  constructor(scene) {
    super(scene)

    this.floorXPosition = 0
  }

  init() {
    super.init()

    this.floorXPosition = 0
  }

  render(time) {
    super.render(time)

    const { screen } = this.scene.game

    this.floorXPosition -= this.scene.game.getSpeed()
    screen.drawImage(ImageType.floor, this.floorXPosition, FLOOR_Y_POSITION)
    if (this.floorXPosition <= screen.width - screen.getImage(ImageType.floor).width) {
      this.floorXPosition = 0
    }
  }
}