import { ScenePart } from '../../scene-part'

/** Анимация отображения рекордных очков */
export class DrawHighScore extends ScenePart {
  constructor(game) {
    super(game)
  }

  render(time) {
    super.render(time)

    const { screen, highScore } = this.game
    screen.printByXCenter(`high score: ${highScore}`, screen.height - 80)
  }
}