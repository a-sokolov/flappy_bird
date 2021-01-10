import { Scene } from '../scene'
import { SHOW_PROGRESS_TIMEOUT, PROGRESS_DOT_COUNT, LOADING_PROGRESS_TIMEOUT } from '../constants'

export class Loading extends Scene {
  constructor(game) {
    super(game)

    this.loadedAt = 0
    this.progress = 0

    this.showProgress = this.showProgress.bind(this)
  }

  init() {
    super.init()

    this.loadedAt = 0
    this.progress = 0
    this.game.intervals.addInterval(SHOW_PROGRESS_TIMEOUT, this.showProgress)
  }

  destroy() {
    super.destroy()

    this.game.intervals.removeInterval(SHOW_PROGRESS_TIMEOUT, this.showProgress)
  }

  showProgress() {
    this.progress++
    if (this.progress > PROGRESS_DOT_COUNT) {
      this.progress = 0
    }
  }

  update(time) {
    if (this.loadedAt === 0 && this.game.screen.isImagesLoaded) {
      this.loadedAt = time
    }

    if (this.loadedAt !== 0 && (time - this.loadedAt) >= LOADING_PROGRESS_TIMEOUT) {
      this.finish(Scene.LOADED)
    }
  }

  render(time) {
    super.render(time)

    this.update(time)

    const { screen } = this.game

    screen.fill('black')
    screen.printByCenter(`Loading${'.'.repeat(this.progress)}`)
  }
}