/** Базовый класс сцены */
export class Scene {
  constructor(game) {
    // Игровой класс
    this.game = game
    // Текущий статус
    this.status = this.constructor.WORKING
    // Пропсы
    this.props = null
    // Зарегистрированные "куски" анимации
    this.sceneParts = []
  }

  // Статусы
  static get WORKING() { return 'WORKING' }
  static get LOADED() { return 'LOADED' }
  static get START_GAME() { return 'START_GAME' }
  static get GAME_OVER() { return 'GAME_OVER' }
  static get NEW_GAME() { return 'NEW_GAME' }
  static get PENDING() { return 'PENDING' }

  /** Инициализация сцены */
  init(props) {
    this.status = this.constructor.WORKING
  }

  /** Метод добавления "куска" анимации */
  addScenePart(part) {
    part.init()
    this.sceneParts.push(part)
  }

  /** Метод для удаления "куска" анимации */
  removeScenePart(part) {
    this.sceneParts = this.sceneParts.filter(item => item !== part)
  }

  /** Метод удаления сцены */
  destroy() {
    this.sceneParts = []
  }

  /** Смена статуса сцены */
  finish(status, props) {
    this.status = status
    this.props = props
  }

  working() {
    this.status = Scene.WORKING
  }

  isWorking() {
    return this.status === Scene.WORKING
  }

  pending() {
    this.status = Scene.PENDING
  }

  isPending() {
    return this.status === Scene.PENDING
  }

  /** Рендер */
  render(time) {
    this.sceneParts.forEach(part => part.render(time))
  }
}