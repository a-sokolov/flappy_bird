import { Scene } from '../scene'
import { SHOW_LOADING_TIMEOUT, LOADING_DOT_COUNT, LOADING_PROGRESS_TIMEOUT } from '../constants'

/** Сцена загрузки ресурсов игры */
export class Loading extends Scene {
  constructor(game) {
    super(game)

    this.showProgress = this.showProgress.bind(this)
  }

  init(props) {
    super.init(props)

    this.loadedAt = 0
    this.progress = 0
    this.game.intervals.addInterval(SHOW_LOADING_TIMEOUT, this.showProgress)
  }

  destroy() {
    super.destroy()

    this.game.intervals.removeInterval(SHOW_LOADING_TIMEOUT, this.showProgress)
  }

  /** Метод для чтения следующей "точки", чтобы показать анимацию загрузки */
  showProgress() {
    this.progress++
    if (this.progress > LOADING_DOT_COUNT) {
      this.progress = 0
    }
  }

  update(time) {
    if (this.loadedAt === 0 && this.game.screen.isImagesLoaded) {
      this.loadedAt = time
    }

    if (this.loadedAt !== 0 && (time - this.loadedAt) >= LOADING_PROGRESS_TIMEOUT) {
      // Как только достигнуто минимальное время загрузки, переходим на следующую сцену
      this.finish(Scene.LOADED)
    }
  }

  render(time) {
    super.render(time)
    this.update(time)

    this.game.screen.fill('black')
    this.game.screen.printByCenter(`Loading${'.'.repeat(this.progress)}`)
  }
}