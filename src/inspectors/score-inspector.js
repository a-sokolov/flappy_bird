export class ScoreInspector {
  constructor(game, birdController, pipesController) {
    this.game = game
    this.birdController = birdController
    this.pipesController = pipesController
  }

  getScore(score) {
    const { pipes } = this.pipesController
    const { x } = this.birdController

    let newScore = score

    pipes.forEach(({ top }) => {
      if ((top.x + top.width) === x) {
        // Если X позиция птички дальше трубы, то прибавляем 1 очко
        newScore++
      }
    })

    this.game.setHighScore(newScore)

    return newScore
  }
}