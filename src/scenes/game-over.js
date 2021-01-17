import { Scene } from '../scene'

import { FLOOR_Y_POSITION } from '../constants'
import { ImageType, HotKeys, EventType } from '../interfaces'

import { DrawScore } from './parts/draw-score'
import { DrawFloor } from './parts/draw-floor'
import { DrawHighScore } from './parts/draw-high-score'

/** Сцена окончания игры */
export class GameOver extends Scene {
  constructor(game) {
    super(game)

    this.drawScore = new DrawScore(game)
    this.drawFloor = new DrawFloor(game)
    this.drawFloor.setSpeed(0)
    this.drawHighScore = new DrawHighScore(game)

    this.newGame = this.newGame.bind(this)
  }

  init(props) {
    super.init(props)

    const { score, floorXPosition, birdController, pipes } = props

    // Инициализируем положения объектов, когда возникла коллизия
    this.gameOverSoundPlayed = false
    this.animationEnded = false
    this.birdController = birdController
    this.drawScore.setScore(score)
    this.drawFloor.setX(floorXPosition)
    this.pipes = pipes

    this.game.control.addListener(HotKeys.jump, this.newGame)
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.jump, this.newGame)
  }

  /** Новая игра */
  newGame() {
    if (this.animationEnded) {
      this.finish(Scene.NEW_GAME)
    }
  }

  /** Считаем когда нужно остановить анимацию падения птички */
  renderBirdDownfallAnimation() {
    if (this.birdController.y + this.birdController.spriteHeight >= FLOOR_Y_POSITION) {
      // Как только птичка упала на пол, то останавливаем анимацию
      this.birdController.bird.stop()
      this.animationEnded = true
    }
  }

  render(time) {
    this.game.screen.drawImage(ImageType.backgroundDay)

    // Рисуем трубы
    this.pipes.forEach(({ top, bottom }) => {
      this.game.screen.drawImage(ImageType.pipeTop, top.x, top.y)
      this.game.screen.drawImage(ImageType.pipeBottom, bottom.x, bottom.y)
    })

    // Отрисовываем падение птички. Т.к. нет движения и обработки прыжка, то "гравитация" сделает свое дело
    this.birdController.render(time)

    if (this.animationEnded) {
      // Как только анимация закончена
      if (!this.gameOverSoundPlayed) {
        this.gameOverSoundPlayed = true
        this.game.events.fireEvent(EventType.gameOver)
      }
      // Рисуем "Конец игры"
      this.game.screen.drawImageByCenter(ImageType.gameOver)
    } else {
      this.renderBirdDownfallAnimation()
    }

    // Рисуем пол, очки и рекордные очки
    this.drawScore.render(time)
    this.drawFloor.render(time)
    this.drawHighScore.render(time)

    super.render(time)
  }
}