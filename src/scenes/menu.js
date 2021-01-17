import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'
import { DrawHighScore } from './parts/draw-high-score'

import { HotKeys, ImageType } from '../interfaces'

export class Menu extends Scene {
  constructor(game) {
    super(game)

    this.startGame = this.startGame.bind(this)
  }

  init(props) {
    super.init(props)

    this.addScenePart(new DrawFloor(this))
    this.addScenePart(new DrawScore(this))
    this.addScenePart(new DrawHighScore(this))

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

    super.render(time)
  }
}