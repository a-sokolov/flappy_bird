import { ScenePart } from '../../scene-part'

export class DrawScore extends ScenePart {
  constructor(scene) {
    super(scene)
  }

  render(time) {
    super.render(time)

    this.scene.game.screen.printByXCenter('score: 0',  70)
  }
}