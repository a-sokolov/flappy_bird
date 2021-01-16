import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'
import { DrawHighScore } from './parts/draw-high-score'

import { BirdController } from './controllers/bird-controller'
import { PipesController } from './controllers/pipes-controller'

import { ScoreInspector } from './inspectors/score-inspector'
import { CollisionsInspector } from './inspectors/collisions-inspector'

import { HotKeys, ImageType } from '../interfaces'

export class GameLevel extends Scene {
  constructor(game) {
    super(game)

    this.restart = this.restart.bind(this)

    this.birdController = new BirdController(game)
    this.pipesController = new PipesController(game)

    this.scoreInspector = new ScoreInspector(game, this.birdController, this.pipesController)
    this.collisionsInspector = new CollisionsInspector(game, this.birdController, this.pipesController)

    this.drawScore = new DrawScore(this)
    this.drawHighScore = new DrawHighScore(this)
  }

  init() {
    super.init()

    this.previousHighScore = this.game.highScore
    this.showHighScore = false
    this.drawScore.setScore(0)
    this.addScenePart(new DrawFloor(this))
    this.addScenePart(this.drawScore)

    this.game.control.addListener(HotKeys.RESTART, this.restart)
    this.birdController.init()
    this.pipesController.init()
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.RESTART, this.restart)
    this.birdController.destroy()
    this.pipesController.destroy()
  }

  restart() {
    this.finish(Scene.NEW_GAME)
  }

  gameOver() {
    this.finish(Scene.GAME_OVER)
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.pipesController.render(time)
    this.birdController.render(time)

    this.pipesController.setPending(this.birdController.isPending)

    let currentScore = this.drawScore.score
    const newScore = this.scoreInspector.getScore(currentScore)
    this.showHighScore = this.previousHighScore + 1 === newScore

    if (this.showHighScore) {
      this.drawHighScore.render(time)
    }
    this.drawScore.setScore(newScore)

    if (this.collisionsInspector.isCollision()) {
      this.gameOver()
    }

    super.render(time)
  }
}