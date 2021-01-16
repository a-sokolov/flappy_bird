import { ScenePart } from '../../scene-part'

export class DrawScore extends ScenePart {
  constructor(scene) {
    super(scene)
    this.score = 0
  }

  setScore(score) {
    this.score = score
  }

  render(time) {
    super.render(time)

    this.scene.game.screen.printByXCenter(`score: ${this.score}`,  70)
  }
}