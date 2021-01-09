import { ScenePart } from '../../scene-part'

export class DrawFloor extends ScenePart {
  constructor(scene) {
    super(scene)

    this.game = scene.game
    this.floorXPosition = 0
  }

  init() {
    super.init()
    this.floorXPosition = 0
  }

  render(time) {
    super.render(time)

    const { screen } = this.game

    this.floorXPosition--
    screen.drawImage('floor', this.floorXPosition, screen.height - 65)
    if (this.floorXPosition <= screen.width - screen.getImage('floor').width) {
      this.floorXPosition = 0
    }
  }
}