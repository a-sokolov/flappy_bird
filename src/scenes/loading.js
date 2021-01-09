import { Scene } from '../scene'

export class Loading extends Scene {
  constructor(game) {
    super(game);
    this.loadedAt = 0
    this.progress = 0
  }

  init() {
    super.init();
    this.loadedAt = 0
    this.progress = 0
    this.game.addInterval(200, this.showProgress.bind(this))
  }

  showProgress() {
    this.progress++
    if (this.progress > 3) {
      this.progress = 0
    }
  }

  update(time) {
    if (this.loadedAt === 0 && this.game.screen.isImagesLoaded) {
      this.loadedAt = time
    }

    if (this.loadedAt !== 0 && (time - this.loadedAt) >= 1500) {
      this.finish(Scene.LOADED)
    }

  }

  render(time) {
    super.render(time);
    this.update(time)

    const {screen} = this.game
    screen.fill('black')
    screen.print(`Loading${'.'.repeat(this.progress)}`, 10, 30)
  }
}