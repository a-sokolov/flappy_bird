import { Controller } from '../../controller'

import { ImageType, HotKeys } from '../../interfaces'
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
} from '../../constants'

import { SpriteSheet } from '../../sprite-sheet'

export class BirdController extends Controller {
  constructor(game) {
    super(game)
    this.game = game
    this.baseLine = game.screen.height / 2
    this.birdTiles = new SpriteSheet(TILES[ImageType.bird])
    this.spriteHeight = TILES[ImageType.bird].spriteHeight
    this.spriteWidth = TILES[ImageType.bird].spriteWidth

    this.jump = this.jump.bind(this)
  }

  init() {
    super.init()
    this.birdMovement = 0
    this.pendingStep = 0
    this.pendingStepIndex = BIRD_PENDING_STEP
    this.x = BIRD_X_POSITION
    this.y = this.baseLine
    this.angle = 0
    this.isPending = true

    // Randomize bird color
    const spriteIndexes = [
      [1, 2, 1, 3], // blue
      [4, 5, 4, 6], // red
      [7, 8, 7, 9] // yellow
    ]
    const index = Math.floor(Math.random() * spriteIndexes.length)

    this.bird = this.birdTiles.getAnimation(spriteIndexes[index], BIRD_FLAP_TIME)
    this.bird.setXY(BIRD_X_POSITION, this.baseLine)

    this.game.control.addListener(HotKeys.JUMP, this.jump)
  }

  destroy() {
    super.destroy()
    this.game.control.removeListener(HotKeys.JUMP, this.jump)
  }

  pending() {
    this.pendingStep += this.pendingStepIndex
    this.y = this.baseLine + this.pendingStep

    if (this.pendingStep >= BIRD_PENDING_Y_GAP) {
      this.pendingStepIndex = -BIRD_PENDING_STEP
    } else if (this.pendingStep <= -BIRD_PENDING_Y_GAP) {
      this.pendingStepIndex = BIRD_PENDING_STEP
    }
  }

  jump() {
    if (this.isPending) {
      this.isPending = false
    }

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

  calcAngle() {
    if (this.y === FLOOR_Y_POSITION - this.spriteHeight) {
      return this.angle
    }

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

    this.bird.setXY(this.x, this.y)
    this.bird.setAngle(this.calcAngle())
    this.game.screen.drawSprite(this.bird)
  }
}