import { ScenePart } from '../../scene-part'
import { ImageType } from '../../interfaces'
import { FLOOR_Y_POSITION } from '../../constants'

/** Отрисовка пола */
export class DrawFloor extends ScenePart {
  constructor(game) {
    super(game)
    // Скорость движения
    this.speed = this.game.getSpeed()
  }

  init() {
    super.init()

    this.x = 0
  }

  /** Метод для установки x координаты */
  setX(x) {
    this.x = x
  }

  /** Метод для установки скорости движения */
  setSpeed(speed) {
    this.speed = speed
  }

  render(time) {
    super.render(time)

    const { screen } = this.game

    // Двигаем пол влево и как только он достигнет предела, начинаем анимацию заново
    this.x -= this.speed
    screen.drawImage(ImageType.floor, this.x, FLOOR_Y_POSITION)
    if (this.x <= screen.width - screen.getImage(ImageType.floor).width) {
      this.x = 0
    }
  }
}