import { HotKeys } from './interfaces'

export class ControlState {
  constructor() {
    this.jump = false
    this.pause = false
    this.restart = false
    this.listeners = []

    this.keyMap = new Map([
      [32, HotKeys.JUMP],
      [80, HotKeys.PAUSE],
      [78, HotKeys.RESTART],
      [77, HotKeys.MENU]
    ])

    document.addEventListener('keydown', event => this.update(event, true))
    document.addEventListener('keyup', event => this.update(event, false))
    document.addEventListener('mousedown', event => this.mouseUpdate(event, true))
    document.addEventListener('mouseup', event => this.mouseUpdate(event, false))
  }

  update(event, pressed) {
    if (this.keyMap.has(event.keyCode)) {
      event.preventDefault()
      event.stopPropagation()

      const key = this.keyMap.get(event.keyCode)
      this[key.toLowerCase()] = pressed
      pressed && this.notify(key)

      console.log(this)
    }
  }

  mouseUpdate(event, pressed) {
    if (event.button === 0 && event.target.localName === 'canvas') {
      console.log(event)

      const key = HotKeys.JUMP
      this[key.toLowerCase()] = pressed
      pressed && this.notify(key)
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