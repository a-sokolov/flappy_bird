import { Scene } from '../scene'
import { DrawFloor } from './parts/draw-floor'
import { ImageType } from '../interfaces'

export class Menu extends Scene {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.addScenePart(new DrawFloor(this))
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.game.screen.drawImageByCenter(ImageType.menu)

    if (this.game.control.jump) {
      this.finish(Scene.START_GAME)
    }

    super.render(time)
  }
}