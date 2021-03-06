import { Controller } from '../controller'

import { ImageType, HotKeys, EventType } from '../interfaces'
import {
  BIRD_FLAP_TIME,
  BIRD_X_POSITION,
  BIRD_PENDING_Y_GAP,
  BIRD_PENDING_STEP,
  TILES,
  GAME_GRAVITY,
  BIRD_JUMP_POINTS,
  FLOOR_Y_POSITION,
  ROTATE_IMAGE_RATIO,
  MAX_ANGLE
} from '../constants'

import { SpriteSheet } from '../sprite-sheet'

/** Контроллер для управления движения птички */
export class BirdController extends Controller {
  constructor(game) {
    super(game)
    this.game = game

    // Базовая линия (середина экрана)
    this.baseLine = game.screen.height / 2
    // Тайловая карта птички
    this.birdTiles = new SpriteSheet(TILES[ImageType.bird])
    // Определяем размеры спрайта анимации
    this.spriteHeight = TILES[ImageType.bird].spriteHeight
    this.spriteWidth = TILES[ImageType.bird].spriteWidth

    this.jump = this.jump.bind(this)
  }

  init() {
    super.init()
    // Движение птички
    this.birdMovement = 0
    // Шаг ожидания
    this.pendingStep = 0
    // Индекс шага ожидания
    this.pendingStepIndex = BIRD_PENDING_STEP
    // Позиция x по координате
    this.x = BIRD_X_POSITION
    // Позиция y по координате (по умолчанию базовая линия)
    this.y = this.baseLine
    // Угол птички
    this.angle = 0
    // Флаг ожидания (если в режиме, то отображаем анимацию)
    this.isPending = true

    // Определяем анимацию птички
    const spriteIndexes = [
      [1, 2, 1, 3], // blue
      [4, 5, 4, 6], // red
      [7, 8, 7, 9] // yellow
    ]
    const index = Math.floor(Math.random() * spriteIndexes.length)

    this.bird = this.birdTiles.getAnimation(spriteIndexes[index], BIRD_FLAP_TIME)
    this.bird.setXY(BIRD_X_POSITION, this.baseLine)

    this.game.control.addListener(HotKeys.jump, this.jump)
  }

  destroy() {
    super.destroy()

    this.game.control.removeListener(HotKeys.jump, this.jump)
  }

  /** Анимация ожидания */
  pending() {
    this.pendingStep += this.pendingStepIndex
    this.y = this.baseLine + this.pendingStep

    if (this.pendingStep >= BIRD_PENDING_Y_GAP) {
      this.pendingStepIndex = -BIRD_PENDING_STEP
    } else if (this.pendingStep <= -BIRD_PENDING_Y_GAP) {
      this.pendingStepIndex = BIRD_PENDING_STEP
    }
  }

  /** Прыжок птички */
  jump() {
    if (this.game.isPause) {
      return
    }
    
    if (this.isPending) {
      this.isPending = false
    }

    this.game.events.fireEvent(EventType.jump)

    if (this.y + BIRD_JUMP_POINTS + GAME_GRAVITY > 0) {
      // Если Y позиция птички + прыжок + гравитация > 0, то добавляем к позиции прыжок.
      // Иначе, ничего не происходит, чтобы птица не вылетала вверх за пределы экрана
      this.birdMovement = 0
      this.birdMovement -= BIRD_JUMP_POINTS
    }
  }

  update() {
    this.birdMovement += GAME_GRAVITY
    // Инициализируем Y позицию
    this.y += this.birdMovement
    if (this.y + this.spriteHeight > FLOOR_Y_POSITION) {
      // Если Y позиция ниже "пола", то птичка остается на уровне
      this.y = FLOOR_Y_POSITION - this.spriteHeight
    }
  }

  /** Метод для вычисления угла наклона морды птички */
  calcAngle() {
    if (this.y === FLOOR_Y_POSITION - this.spriteHeight) {
      // Как только птички "упала", а значит она все это время падала и соответственно морда должна смотреть вниз
      // и чтобы было анимации "птичка крутиться на полу", то возвращаем предыдущее значение угла
      return this.angle
    }

    // Вычисляем угол положения морды
    let angle
    angle = this.birdMovement * ROTATE_IMAGE_RATIO
    angle = angle > MAX_ANGLE ? MAX_ANGLE : angle
    this.angle = angle

    return angle
  }

  render(time) {
    super.render(time)

    this.bird.update(time)
    if (this.isPending) {
      this.pending()
    } else {
      this.update()
    }

    // Устанавливаем новые координаты и угол положения морды
    this.bird.setXY(this.x, this.y)
    this.bird.setAngle(this.calcAngle())
    this.game.screen.drawSprite(this.bird)
  }
}