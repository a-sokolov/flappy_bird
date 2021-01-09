import { ImageLoader } from './image-loader'

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
    const root = document.getElementById('root')
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

  fill(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.width, this.height)
  }

  print(text, x, y) {
    this.context.fillStyle = 'white'
    this.context.font = '22px Georgia'
    this.context.fillText(text, x, y)
  }

  drawImage(name, x = 0, y = 0) {
    this.context.drawImage(this.images[name], x, y)
  }
}