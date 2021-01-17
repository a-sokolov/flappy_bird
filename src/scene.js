export class Scene {
  constructor(game) {
    this.game = game
    this.status = this.constructor.WORKING
    this.props = null
    this.sceneParts = []
  }

  static get WORKING() { return 'WORKING' }
  static get LOADED() { return 'LOADED' }
  static get START_GAME() { return 'START_GAME' }
  static get GAME_OVER() { return 'GAME_OVER' }
  static get FINISHED() { return 'FINISHED' }
  static get NEW_GAME() { return 'NEW_GAME' }

  init(props) {
    this.status = this.constructor.WORKING
  }

  addScenePart(part) {
    part.init()
    this.sceneParts.push(part)
  }

  removeScenePart(part) {
    this.sceneParts = this.sceneParts.filter(item => item !== part)
  }

  destroy() {
    this.sceneParts = []
  }

  finish(status, props) {
    this.status = status
    this.props = props
  }

  render(time) {
    this.sceneParts.forEach(part => part.render(time))
  }
}