import { Sprite } from './sprite'
import { Animation } from './animation'

/** Класс для чтения тайловой карты */
export class SpriteSheet {
  constructor({ imageName, imageWidth, imageHeight, spriteWidth, spriteHeight }) {
    this.imageName = imageName
    this.imageWidth = imageWidth
    this.imageHeight = imageHeight
    this.spriteWidth = spriteWidth
    this.spriteHeight = spriteHeight
  }

  /**
   * Метод для создания анимации.
   * @param indexes массив индексов кадров
   * @param speed скорость анимации (как часто обновлять кадры)
   * @param repeat флаг, что анимацию нужно повторять, как только она закончится
   * @param autorun флаг, что анимация запускается сразу
   * */
  getAnimation(indexes, speed, repeat = true, autorun = true) {
    return new Animation({
      imageName: this.imageName,
      frames: indexes.map(index => ({ sx: this.getSourceX(index), sy: this.getSourceY(index) })),
      speed: speed,
      repeat: repeat,
      autorun: autorun,
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  /** Метод для создания спрайта по заданному индексу */
  getSprite(index) {
    return new Sprite({
      imageName: this.imageName,
      sourceX: this.getSourceX(index),
      sourceY: this.getSourceY(index),
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  /** Метод для получения x позиции по заданному индексу */
  getSourceX(index) {
    return (--index * this.spriteWidth) % this.imageWidth
  }

  /** Метод для получения y позиции по заданному индексу */
  getSourceY(index) {
    return Math.trunc((--index * this.spriteWidth) / this.imageWidth) * this.spriteHeight
  }
}