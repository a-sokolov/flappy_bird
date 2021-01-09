import { Screen } from './canvas'
import { Scene } from './scene'
import { Loading } from './scenes/loading'
import { Menu } from './scenes/menu'

export class Game {
  constructor({ width = 288, height = 512 }) {
    this.intervals = []
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
      yellowBirdUpFlap: './assets/img/yellowbird-upflap.png'
    })
    this.scenes = {
      loading: new Loading(this),
      menu: new Menu(this)
    }
    this.currentScene = this.scenes.loading
    this.currentScene.init()
  }

  changeScene(status) {
    switch (status) {
      case Scene.LOADED:
        return this.scenes.menu
      default:
        return this.scenes.menu
    }
  }

  frame(time) {
    this.checkIntervals(time)
    if (this.currentScene.status !== Scene.WORKING) {
      this.currentScene = this.changeScene(this.currentScene.status)
      this.currentScene.init()
    }

    this.currentScene.render(time)
    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    requestAnimationFrame(time => this.frame(time))
  }

  addInterval(timeout, callback) {
    this.intervals.push({ timeout, callback, time: 0 })
  }

  checkIntervals(time) {
    this.intervals.forEach(interval => {
      if (time - interval.time >= interval.timeout) {
        interval.callback && interval.callback()
        interval.time = time
      }
    })
  }
}