import { Scene } from '../scene'
import { DrawFloor } from './parts/draw-floor';

export class Menu extends Scene {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.addScenePart(new DrawFloor(this))
  }

  update(time) {
    if (this.game.control.jump) {
      this.finish(Scene.START_GAME)
    }
  }

  render(time) {
    this.game.screen.drawImage('backgroundDay')
    this.game.screen.drawImageByCenter('menu')

    this.update(time)
    super.render(time)
  }
}