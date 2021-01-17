import { EventType, AudioType } from './interfaces'

export class Events {
  constructor(game) {
    this.game = game
  }

  fireEvent(eventType) {
    let audioName

    switch (eventType) {
      case EventType.gameOver:
        audioName = AudioType.gameOver
        break
      case EventType.jump:
        audioName = AudioType.jump
        break
      case EventType.score:
        audioName = AudioType.score
        break
      case EventType.highScore:
        audioName = AudioType.highScore
        break
      case EventType.fail:
        audioName = AudioType.fail
        break
      default:
        return
    }

    this.game.audio.play(audioName)
  }

}