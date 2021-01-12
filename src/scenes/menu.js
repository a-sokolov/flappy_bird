import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'

import { HotKeys, ImageType } from '../interfaces'

export class Menu extends Scene {
  constructor(game) {
    super(game)

    this.startGame = this.startGame.bind(this)
  }

  init() {
    super.init()

    this.addScenePart(new DrawFloor(this))
    this.addScenePart(new DrawScore(this))

    this.game.control.addListener(HotKeys.JUMP, this.startGame)
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.JUMP, this.startGame)
  }

  startGame() {
    this.finish(Scene.START_GAME)
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.game.screen.drawImageByCenter(ImageType.menu)
    this.game.screen.printByXCenter(`high score: ${this.game.highScore}`, this.game.screen.height - 80)

    super.render(time)
  }
}