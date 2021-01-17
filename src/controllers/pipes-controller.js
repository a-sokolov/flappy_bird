import { Controller } from '../controller'

import { PIPE_SPACE_BETWEEN, TOP_PIPE_MINIMUM_HEIGHT, NEXT_PIPE_POINT } from '../constants'
import { ImageType } from '../interfaces'

export class PipesController extends Controller {
  constructor(game) {
    super(game)
  }

  init() {
    super.init()

    this.pipes = []
    this.pipes.push(this.createPipe())
    this.isPending = true
  }

  destroy() {
    super.destroy()

    this.pipes = []
  }

  createPipe() {
    const pipeTopImage = this.game.screen.getImage(ImageType.pipeTop)
    const pipeBottomImage = this.game.screen.getImage(ImageType.pipeBottom)

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
    this.pipes.forEach((pipe) => {
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
  }

  render(time) {
    super.render(time)

    if (!this.isPending) {
      this.update()
    }
  }
}