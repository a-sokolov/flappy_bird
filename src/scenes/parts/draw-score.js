import { ScenePart } from '../../scene-part'

/** Анимация отображения текущих очков игрока */
export class DrawScore extends ScenePart {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.score = 0
  }

  setScore(score) {
    this.score = score
  }

  render(time) {
    super.render(time)

    this.game.screen.printByXCenter(`score: ${this.score}`,  70)
  }
}