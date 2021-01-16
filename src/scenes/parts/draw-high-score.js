import { ScenePart } from '../../scene-part'

export class DrawHighScore extends ScenePart {
  constructor(scene) {
    super(scene)
  }

  render(time) {
    super.render(time)

    const { game } = this.scene
    game.screen.printByXCenter(`high score: ${game.highScore}`, game.screen.height - 80)
  }
}