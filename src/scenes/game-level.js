import { Scene } from '../scene'
import { DrawFloor } from './parts/draw-floor'

export class GameLevel extends Scene {
  constructor(game) {
    super(game)

    this.restart = this.restart.bind(this)
  }

  init() {
    super.init()
    this.addScenePart(new DrawFloor(this))
    this.game.control.addListener('restart', this.restart)
  }

  destroy() {
    super.destroy()
    this.game.control.removeListener('restart', this.restart)
  }

  restart() {
    this.finish(Scene.NEW_GAME)
  }

  render(time) {
    this.game.screen.drawImage('backgroundDay')

    super.render(time)
  }
}