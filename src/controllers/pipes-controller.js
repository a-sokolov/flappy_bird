import { Controller } from '../controller'

import { PIPE_SPACE_BETWEEN, TOP_PIPE_MINIMUM_HEIGHT, NEXT_PIPE_POINT } from '../constants'
import { ImageType } from '../interfaces'

/** Контроллер создания и движения труб */
export class PipesController extends Controller {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.pipes = []
    // При инициализации создаем 1ую трубу, т.к. от её координат будем создавать следующие
    this.pipes.push(this.createPipe())
    this.isPending = true
  }

  destroy() {
    super.destroy()

    this.pipes = []
  }

  /** Метод для создания трубы */
  createPipe() {
    // Инициализируем размеры изображений
    const pipeTopImage = this.game.screen.getImage(ImageType.pipeTop)
    const pipeBottomImage = this.game.screen.getImage(ImageType.pipeBottom)

    // Определяем координаты верхней трубы (рандом)
    const top = {
      x: this.game.screen.width,
      // Y позиция вычисляется случайным образом
      y: Math.floor(Math.random() * pipeTopImage.height) - pipeTopImage.height,
      width: pipeTopImage.width,
      height: pipeTopImage.height
    }

    // Вычисляем дельту высоты верхней трубы
    const delta = pipeTopImage.height + top.y
    if (delta < TOP_PIPE_MINIMUM_HEIGHT) {
      // Если она меньше константы, то добавляем разницу (чтобы верхний край не обрезался)
      top.y += TOP_PIPE_MINIMUM_HEIGHT - delta
    }

    // Определяем координаты нижней трубы, относительно верхней, добавляя константу расстояния между ними
    const bottom = {
      x: this.game.screen.width,
      y: top.y + pipeTopImage.height + PIPE_SPACE_BETWEEN,
      width: pipeBottomImage.width,
      height: pipeBottomImage.height
    }

    return { top, bottom }
  }

  setPending(isPending) {
    this.isPending = isPending
  }

  update() {
    this.pipes.forEach(pipe => {
      const { top, bottom } = pipe

      this.game.screen.drawImage(ImageType.pipeTop, top.x, top.y)
      this.game.screen.drawImage(ImageType.pipeBottom, bottom.x, bottom.y)

      top.x -= this.game.getSpeed()
      bottom.x -= this.game.getSpeed()

      if (top.x === NEXT_PIPE_POINT) {
        // Как только X позиция трубы доходит до отметки, создаем новую пару
        this.pipes.push(this.createPipe())
      }
    })

    if (this.pipes[0]) {
      const { top, bottom } = this.pipes[0]
      if (top.x + top.width < 0 || bottom.x + bottom.width < 0) {
        // Как только пара труб ушла за границу экрана, то удаляем её из массива, т.к. она больше не нужна
        this.pipes.shift()
      }
    }
  }

  render(time) {
    super.render(time)

    if (!this.isPending) {
      // Запускаем анимацию, когда режим "ожидания" закончен
      this.update()
    }
  }
}