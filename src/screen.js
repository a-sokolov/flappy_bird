import { ImageLoader } from './loaders/image-loader'
import { GAME_DEFINITION } from './constants'

export class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = this.createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
    this.images = {}
    this.isImagesLoaded = false
  }

  createCanvas(width, height) {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')
    if (elements.length) {
      return elements[0]
    }

    const canvas = document.createElement('canvas')
    root.appendChild(canvas)

    canvas.width = width
    canvas.height = height

    return canvas
  }

  loadImages(imageFiles) {
    const loader = new ImageLoader(imageFiles)
    loader.load().then(names => {
      this.images = Object.assign(this.images, loader.images)
      this.isImagesLoaded = true
      console.log(names)
    })
  }

  getImage(name) {
    return this.images[name]
  }

  fill(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.width, this.height)
  }

  print(text, x, y) {
    const { name, size } = GAME_DEFINITION.font

    this.context.fillStyle = 'white'
    this.context.font = `${size} "${name}"`
    this.context.fillText(text, x, y)
  }

  printByCenter(text) {
    this.context.textAlign = 'center'
    this.print(text, this.width / 2, this.height / 2)
  }

  printByXCenter(text, y) {
    this.context.textAlign = 'center'
    this.print(text, this.width / 2, y)
  }

  drawImage(name, x = 0, y = 0) {
    const image = this.images[name]
    this.context.drawImage(image, x, y)
  }

  drawImageByCenter(name) {
    const image = this.images[name]
    this.context.drawImage(image, this.width / 2 - image.width / 2, this.height / 2 - image.height / 2)
  }

  drawSprite(sprite) {
    const image = this.images[sprite.imageName]

    if (sprite.angle === 0) {
      this.context.drawImage(image,
        sprite.sourceX, sprite.sourceY, sprite.width, sprite.height,
        sprite.x, sprite.y, sprite.width, sprite.height)
    } else {
      this.context.save()
      this.context.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2)
      this.context.rotate(sprite.angle)
      this.context.translate(-(sprite.x + sprite.width / 2), -(sprite.y + sprite.height / 2))

      this.context.drawImage(image,
        sprite.sourceX, sprite.sourceY, sprite.width, sprite.height,
        sprite.x, sprite.y, sprite.width, sprite.height)

      this.context.restore()
    }
  }
}