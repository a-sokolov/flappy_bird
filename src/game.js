import { Screen } from './canvas'
import { Audio } from './audio'
import { Scene } from './scene'
import { Intervals } from './intervals'
import { ControlState } from './control-state'

import { Loading } from './scenes/loading'
import { Menu } from './scenes/menu'
import { GameLevel } from './scenes/game-level'

export class Game {
  constructor({ width = 288, height = 512 }) {
    this.intervals = new Intervals()
    this.screen = new Screen(width, height)
    this.screen.loadImages({
      backgroundDay: './assets/img/background-day.png',
      backgroundNight: './assets/img/background-night.png',
      blueBirdDownFlap: './assets/img/bluebird-downflap.png',
      blueBirdMiddleFlap: './assets/img/bluebird-midflap.png',
      blueBirdUpFlap: './assets/img/bluebird-upflap.png',
      floor: './assets/img/floor.png',
      gameOver: './assets/img/game-over.png',
      pipeBottom: './assets/img/pipe-bottom.png',
      pipeTop: './assets/img/pipe-top.png',
      redBirdDownFlap: './assets/img/redbird-downflap.png',
      redBirdMiddleFlap: './assets/img/redbird-midflap.png',
      redBirdUpFlap: './assets/img/redbird-upflap.png',
      yellowBirdDownFlap: './assets/img/yellowbird-downflap.png',
      yellowBirdMiddleFlap: './assets/img/yellowbird-midflap.png',
      yellowBirdUpFlap: './assets/img/yellowbird-upflap.png',
      menu: './assets/img/menu.png'
    })
    this.audio = new Audio()
    this.audio.loadAudio({
      fail: './assets/audio/fail.mp3',
      flap: './assets/audio/flap.mp3',
      gameOver: './assets/audio/game-over.mp3',
      jump: './assets/audio/jump.mp3',
      score: './assets/audio/score.mp3'
    })
    this.control = new ControlState()
    this.scenes = {
      loading: new Loading(this),
      menu: new Menu(this),
      gameLevel: new GameLevel(this)
    }
    this.currentScene = this.scenes.loading
    this.currentScene.init()

    this.animationId = 0
    this.isPause = false

    this.pause = this.pause.bind(this)
    this.menu = this.menu.bind(this)

    this.control.addListener('pause', this.pause)
    this.control.addListener('menu', this.menu)
  }

  changeScene(status) {
    let scene
    switch (status) {
      case Scene.LOADED:
        scene = this.scenes.menu
        break
      case Scene.START_GAME:
      case Scene.NEW_GAME:
        scene = this.scenes.gameLevel
        break
      default:
        scene = this.scenes.menu
    }

    this.setScene(scene)
  }

  setScene(scene) {
    this.currentScene?.destroy()
    this.currentScene = scene
    this.currentScene.init()
  }

  pause() {
    if (this.currentScene === this.scenes.gameLevel) {
      this.isPause = !this.isPause
      this.isPause && this.stop()
      !this.isPause && this.run()
    }
  }

  menu() {
    if (this.currentScene === this.scenes.gameLevel) {
      this.setScene(this.scenes.menu)
    }
  }

  frame(time) {
    if (this.currentScene.status !== Scene.WORKING) {
      this.changeScene(this.currentScene.status)
    }

    this.currentScene.render(time)
    this.intervals.checkIntervals(time)
    this.animationId = requestAnimationFrame(time => this.frame(time))
  }

  run() {
    this.animationId = requestAnimationFrame(time => this.frame(time))
  }

  stop() {
    cancelAnimationFrame(this.animationId)
    this.animationId = 0
  }
}