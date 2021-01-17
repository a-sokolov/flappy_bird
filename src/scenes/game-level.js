import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'
import { DrawHighScore } from './parts/draw-high-score'

import { BirdController } from '../controllers/bird-controller'
import { PipesController } from '../controllers/pipes-controller'

import { ScoreInspector } from '../inspectors/score-inspector'
import { CollisionsInspector } from '../inspectors/collisions-inspector'

import { HotKeys, ImageType, EventType } from '../interfaces'
import { CHANGE_BACKGROUND_IMAGE_TIMEOUT } from '../constants'

/** Игровая сцена */
export class GameLevel extends Scene {
  constructor(game) {
    super(game)

    this.restart = this.restart.bind(this)
    this.changeBackgroundImage = this.changeBackgroundImage.bind(this)

    // Создаем контроллеры управления птичкой и трубами
    this.birdController = new BirdController(game)
    this.pipesController = new PipesController(game)

    // Создаем инспекторы игровых очков и коллизий
    this.scoreInspector = new ScoreInspector(this.birdController, this.pipesController)
    this.collisionsInspector = new CollisionsInspector(this.birdController, this.pipesController)

    // Создаем анимацию пола, очков и рекордных очков
    this.drawScore = new DrawScore(game)
    this.drawFloor = new DrawFloor(game)
    this.drawHighScore = new DrawHighScore(game)
  }

  init(props) {
    super.init(props)

    // Фон
    this.backgroundImage = ImageType.backgroundDay
    // Флаг, что звук рекорда был проигран
    this.highScoreSoundPlayed = false
    // Предыдущее значение рекорда
    this.previousHighScore = this.game.highScore
    // Флаг, что показываем новый рекорд
    this.showHighScore = false
    // Флаг, что игра началась
    this.isGameStarted = false

    this.drawScore.setScore(0)
    this.addScenePart(this.drawFloor)
    this.addScenePart(this.drawScore)

    this.birdController.init()
    this.pipesController.init()

    this.game.control.addListener(HotKeys.restart, this.restart)
  }

  destroy() {
    super.destroy()

    this.birdController.destroy()
    this.pipesController.destroy()

    this.game.control.removeListener(HotKeys.restart, this.restart)
    this.game.intervals.removeInterval(CHANGE_BACKGROUND_IMAGE_TIMEOUT, this.changeBackgroundImage)
  }

  /** Перезапуск игры */
  restart() {
    this.finish(Scene.NEW_GAME)
  }

  /** Игра окончена, меняем статус и передаем текущие параметры игровой сцены */
  gameOver() {
    this.finish(Scene.GAME_OVER, {
      score: this.drawScore.score,
      birdController: this.birdController,
      pipes: [...this.pipesController.pipes],
      floorXPosition: this.drawFloor.x,
      backgroundImage: this.backgroundImage
    })
  }

  changeBackgroundImage() {
    this.backgroundImage =
      this.backgroundImage === ImageType.backgroundDay
          ? ImageType.backgroundNight
          : ImageType.backgroundDay
  }

  render(time) {
    this.game.screen.drawImage(this.backgroundImage)
    // Рисуем трубы
    this.pipesController.render(time)
    // Рисуем птичку
    this.birdController.render(time)

    // Как только игрок стартовал игру, то передаем контроллеру "труб" начать анимацию
    this.pipesController.setPending(this.birdController.isPending)
    if (!this.isGameStarted && !this.birdController.isPending) {
      this.game.events.fireEvent(EventType.gameStarted)
      this.isGameStarted = true
      this.game.intervals.addInterval(CHANGE_BACKGROUND_IMAGE_TIMEOUT, this.changeBackgroundImage, time)
    }

    // Отображаем игровые очки
    let currentScore = this.drawScore.score
    const newScore = this.scoreInspector.getScore(currentScore)
    this.game.setHighScore(newScore)
    if (newScore > currentScore) {
      // Новый рекорд
      this.game.events.fireEvent(EventType.score)
    }
    this.showHighScore = this.previousHighScore + 1 === newScore

    if (this.showHighScore && this.previousHighScore > 0) {
      // Отображаем новый рекорд
      if (!this.highScoreSoundPlayed) {
        this.highScoreSoundPlayed = true
        this.game.events.fireEvent(EventType.highScore)
      }
      this.drawHighScore.render(time)
    }
    this.drawScore.setScore(newScore)

    if (this.collisionsInspector.isCollision()) {
      // Проверяем коллизию и если есть "столкновение", то переходим на сцену "Конец игры"
      this.game.events.fireEvent(EventType.fail)
      this.game.events.fireEvent(EventType.gameEnded)
      this.gameOver()
    }

    super.render(time)
  }
}