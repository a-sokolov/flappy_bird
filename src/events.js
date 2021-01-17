import { EventType, AudioType } from './interfaces'

/** Класс основных событий игры */
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
      case EventType.gameStarted:
        this.game.audio.loop(AudioType.background)
        return
      case EventType.gameEnded:
        this.game.audio.stop(AudioType.background)
        return
      default:
        return
    }

    this.game.audio.play(audioName)
  }

}