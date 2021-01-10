import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'

import { ImageType } from '../interfaces'

export class Menu extends Scene {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.addScenePart(new DrawFloor(this))
    this.addScenePart(new DrawScore(this))
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.game.screen.drawImageByCenter(ImageType.menu)
    this.game.screen.printByXCenter(`high score: ${this.game.highScore}`, this.game.screen.height - 80)

    if (this.game.control.jump) {
      this.finish(Scene.START_GAME)
    }

    super.render(time)
  }
}