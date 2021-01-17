import { Screen } from './screen'
import { Audio } from './audio'
import { Scene } from './scene'
import { Intervals } from './intervals'
import { ControlState } from './control-state'
import { Events } from './events'

import { IMAGES, AUDIOS, GAME_DEFINITION, GAME_SPEED } from './constants'
import { HotKeys } from './interfaces'

import { Loading } from './scenes/loading'
import { Menu } from './scenes/menu'
import { GameLevel } from './scenes/game-level'
import { GameOver } from './scenes/game-over'

export class Game {
  constructor(props = {}) {
    const { width = GAME_DEFINITION.width, height = GAME_DEFINITION.height } = props

    this.intervals = new Intervals()
    this.screen = new Screen(width, height)
    this.screen.loadImages(IMAGES)
    this.audio = new Audio()
    this.audio.loadAudio(AUDIOS)

    this.control = new ControlState()
    this.events = new Events(this)

    this.scenes = {
      loading: new Loading(this),
      menu: new Menu(this),
      gameLevel: new GameLevel(this),
      gameOver: new GameOver(this)
    }
    this.currentScene = this.scenes.loading
    this.currentScene.init()

    this.animationId = 0
    this.isPause = false
    this.highScore = 0

    this.pause = this.pause.bind(this)
    this.menu = this.menu.bind(this)

    this.control.addListener(HotKeys.PAUSE, this.pause)
    this.control.addListener(HotKeys.MENU, this.menu)
  }

  changeScene(status, props) {
    let scene
    switch (status) {
      case Scene.LOADED:
        this.callbackAfterLoading?.()
        scene = this.scenes.menu
        break
      case Scene.START_GAME:
      case Scene.NEW_GAME:
        scene = this.scenes.gameLevel
        break
      case Scene.GAME_OVER:
        scene = this.scenes.gameOver
        break
      default:
        scene = this.scenes.menu
    }

    this.setScene(scene, props)
  }

  setScene(scene, props) {
    this.currentScene.destroy()
    this.currentScene = scene
    this.currentScene.init(props)
  }

  pause() {
    if (this.currentScene instanceof GameLevel) {
      this.isPause = !this.isPause
      this.isPause && this.stop()
      !this.isPause && this.run()
    }
  }

  menu() {
    if (this.currentScene instanceof GameLevel) {
      this.setScene(this.scenes.menu)
    }
  }

  frame(time) {
    if (this.currentScene.status !== Scene.WORKING) {
      this.changeScene(this.currentScene.status, this.currentScene.props)
    }

    this.currentScene.render(time)
    this.intervals.checkIntervals(time)
    this.animationId = requestAnimationFrame(time => this.frame(time))
  }

  run(callbackAfterLoading) {
    this.animationId = requestAnimationFrame(time => this.frame(time))
    this.callbackAfterLoading = callbackAfterLoading
  }

  stop() {
    cancelAnimationFrame(this.animationId)
    this.animationId = 0
  }

  getSpeed() {
    return GAME_SPEED
  }

  setHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score
    }
  }
}