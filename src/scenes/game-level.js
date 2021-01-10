import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'

import { BirdController } from './controllers/bird-controller';

import { HotKeys, ImageType } from '../interfaces'


export class GameLevel extends Scene {
  constructor(game) {
    super(game)

    this.restart = this.restart.bind(this)

    this.birdController = new BirdController(game)
  }

  init() {
    super.init()

    this.addScenePart(new DrawFloor(this))
    this.addScenePart(new DrawScore(this))

    this.game.control.addListener(HotKeys.RESTART, this.restart)
    this.birdController.init()
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.RESTART, this.restart)
    this.birdController.destroy()
  }

  restart() {
    this.finish(Scene.NEW_GAME)
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.birdController.render(time)

    super.render(time)
  }
}