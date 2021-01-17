import { Scene } from '../scene'

import { DrawFloor } from './parts/draw-floor'
import { DrawScore } from './parts/draw-score'
import { DrawHighScore } from './parts/draw-high-score'

import { HotKeys, ImageType } from '../interfaces'

/** Сцена для отображения основного меню */
export class Menu extends Scene {
  constructor(game) {
    super(game)

    this.startGame = this.startGame.bind(this)
  }

  init(props) {
    super.init(props)

    // Добавляем анимацию пола, очков и рекордных очков
    this.addScenePart(new DrawFloor(this.game))
    this.addScenePart(new DrawScore(this.game))
    this.addScenePart(new DrawHighScore(this.game))

    this.game.control.addListener(HotKeys.jump, this.startGame)
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.jump, this.startGame)
  }

  /** Метод для запуска игры */
  startGame() {
    this.finish(Scene.START_GAME)
  }

  render(time) {
    // Рисуем фон и меню
    this.game.screen.drawImage(ImageType.backgroundDay)
    this.game.screen.drawImageByCenter(ImageType.menu)

    super.render(time)
  }
}