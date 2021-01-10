import { ImageType } from '../../interfaces';
import { BIRD_FLAP_TIME, BIRD_X_POSITION, BIRD_PENDING_Y_GAP, BIRD_PENDING_STEP } from '../../constants'

export class BirdController {
  constructor(game) {
    this.game = game

    this.imageIndex = 0
    this.prevImageIndex = 0
    this.baseLine = game.screen.height / 2
    this.pendingStep = 0
    this.pendingStepIndex = BIRD_PENDING_STEP
    this.x = BIRD_X_POSITION
    this.y = this.baseLine
    this.isPending = true

    this.changeBirdFlap = this.changeBirdFlap.bind(this)
  }

  init() {
    // Randomize bird color
    const colors = ['red', 'blue', 'yellow']
    const color = colors[Math.floor(Math.random() * colors.length)]

    this.flapImages = [
      ImageType[`${color}BirdUpFlap`],
      ImageType[`${color}BirdMiddleFlap`],
      ImageType[`${color}BirdDownFlap`]
    ]

    this.game.intervals.addInterval(BIRD_FLAP_TIME, this.changeBirdFlap)
  }

  destroy() {
    this.game.intervals.removeInterval(BIRD_FLAP_TIME, this.changeBirdFlap)
  }

  changeBirdFlap() {
    const currentIndex = this.imageIndex

    switch (this.imageIndex) {
      case 0:
      case 2:
        this.imageIndex = 1
        break
      case 1:
        this.imageIndex = this.prevImageIndex === 0 ? 2 : 0
    }

    this.prevImageIndex = currentIndex
  }

  pending() {
    this.pendingStep += this.pendingStepIndex
    this.y = this.baseLine + this.pendingStep
    switch (this.pendingStep) {
      case BIRD_PENDING_Y_GAP:
        this.pendingStepIndex = -BIRD_PENDING_STEP
        break
      case -BIRD_PENDING_Y_GAP:
        this.pendingStepIndex = BIRD_PENDING_STEP
        break
    }
  }

  render(drawBird, time) {
    if (this.isPending) {
      this.pending()
    }

    drawBird.setImage(this.flapImages[this.imageIndex])
    drawBird.setCoordinates(this.x, this.y)
    drawBird.render(time)
  }
}