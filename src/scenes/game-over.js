import { Scene } from '../scene'

import { FLOOR_Y_POSITION } from '../constants'
import { ImageType, HotKeys, EventType } from '../interfaces'

import { DrawScore } from './parts/draw-score'
import { DrawFloor } from './parts/draw-floor'
import { DrawHighScore } from './parts/draw-high-score'

export class GameOver extends Scene {
  constructor(game) {
    super(game)

    this.drawScore = new DrawScore(this)
    this.drawFloor = new DrawFloor(this)
    this.drawFloor.setSpeed(0)
    this.drawHighScore = new DrawHighScore(this)

    this.newGame = this.newGame.bind(this)
  }

  init(props) {
    super.init(props)

    const { score, floorXPosition, birdController, pipes } = props

    this.gameOverSoundPlayed = false
    this.animationEnded = false
    this.birdController = birdController
    this.drawScore.setScore(score)
    this.drawFloor.setX(floorXPosition)
    this.pipes = pipes
    this.game.control.addListener(HotKeys.JUMP, this.newGame)
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.JUMP, this.newGame)
  }

  newGame() {
    if (this.animationEnded) {
      this.finish(Scene.NEW_GAME)
    }
  }

  renderBirdDownfallAnimation() {
    if (this.birdController.y + this.birdController.spriteHeight >= FLOOR_Y_POSITION) {
      this.birdController.bird.stop()
      this.animationEnded = true
    }
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)

    this.pipes.forEach(({ top, bottom }) => {
      this.game.screen.drawImage(ImageType.pipeTop, top.x, top.y)
      this.game.screen.drawImage(ImageType.pipeBottom, bottom.x, bottom.y)
    })

    this.birdController.render(time)

    if (this.animationEnded) {
      if (!this.gameOverSoundPlayed) {
        this.gameOverSoundPlayed = true
        this.game.events.fireEvent(EventType.gameOver)
      }
      this.game.screen.drawImageByCenter(ImageType.gameOver)
    } else {
      this.renderBirdDownfallAnimation()
    }

    this.drawScore.render(time)
    this.drawFloor.render(time)
    this.drawHighScore.render(time)

    super.render(time)
  }
}