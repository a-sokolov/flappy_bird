export class ControlState {
  constructor() {
    this.jump = false
    this.pause = false
    this.restart = false
    this.listeners = []

    this.keyMap = new Map([
      [32, 'jump'],
      [80, 'pause'],
      [78, 'restart'],
      [77, 'menu']
    ])

    document.addEventListener('keydown', event => this.update(event, true))
    document.addEventListener('keyup', event => this.update(event, false))
  }

  update(event, pressed) {
    if (this.keyMap.has(event.keyCode)) {
      event.preventDefault()
      event.stopPropagation()

      const key = this.keyMap.get(event.keyCode)
      this[key] = pressed
      pressed && this.notify(key)

      console.log(this)
    }
  }

  notify(key) {
    this.listeners.filter(item => item.key === key).forEach(({ listener }) => listener())
  }

  addListener(key, listener) {
    this.listeners.push({ key, listener })
  }

  removeListener(key, listener) {
    this.listeners = this.listeners.filter(item => {
      return !(item.key === key && item.listener === listener)
    })
  }
}