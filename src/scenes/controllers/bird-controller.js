import { ImageType } from '../../interfaces';
import { BIRD_FLAP_TIME, BIRD_X_POSITION, BIRD_PENDING_Y_GAP, BIRD_PENDING_STEP } from '../../constants'

import { SpriteSheet } from '../../sprite-sheet'

export class BirdController {
  constructor(game) {
    this.game = game
    this.baseLine = game.screen.height / 2
    this.birdTiles = new SpriteSheet({
      imageName: ImageType.bird,
      imageWidth: 102,
      imageHeight: 72,
      spriteWidth: 34,
      spriteHeight: 24
    })
  }

  init() {
    this.pendingStep = 0
    this.pendingStepIndex = BIRD_PENDING_STEP
    this.x = BIRD_X_POSITION
    this.y = this.baseLine
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
  }

  destroy() {
    // destroy
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

  render(time) {
    this.bird.update(time)
    if (this.isPending) {
      this.pending()
    }

    this.bird.setXY(this.x, this.y)
    this.game.screen.drawSprite(this.bird)
  }
}