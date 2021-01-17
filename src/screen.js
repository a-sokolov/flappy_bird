import { ImageLoader } from './loaders/image-loader'
import { GAME_DEFINITION } from './constants'

/** Экран */
export class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = this.createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
    this.images = {}
    this.isImagesLoaded = false
  }

  /**
   * Метод для "холста"
   * @param width ширина
   * @param height высота
   * */
  createCanvas(width, height) {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')
    if (elements.length) {
      // Если нашли ранее созданный, то возвращаем его
      return elements[0]
    }

    // Создаем "холст" и инициализируем его
    const canvas = document.createElement('canvas')
    root.appendChild(canvas)

    canvas.width = width
    canvas.height = height

    return canvas
  }

  /**
   * Метод для загрузки изображений.
   * @param imageFiles массив изображений */
  loadImages(imageFiles) {
    const loader = new ImageLoader(imageFiles)
    loader.load().then(names => {
      this.images = Object.assign(this.images, loader.images)
      this.isImagesLoaded = true
      console.log(names)
    })
  }

  /**
   * Метод для чтения изображения по его имени
   * @param name имя изображения {@link ImageType}*/
  getImage(name) {
    return this.images[name]
  }

  /**
   * Метод для заполнения "холста" цветом
   * @param color цвет заполнения */
  fill(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.width, this.height)
  }

  /**
   * Метод для вывода текста.
   * @param text текст сообщения
   * @param x позиция по x координате
   * @param y позиция по y координате
   * */
  print(text, x, y) {
    // Шрифт и размер берем из игровых настроек
    const { name, size } = GAME_DEFINITION.font

    this.context.fillStyle = 'white'
    this.context.font = `${size} "${name}"`
    this.context.fillText(text, x, y)
  }

  /**
   * Вывод текста по середине экрана.
   * @param text текст сообщения
   * */
  printByCenter(text) {
    this.context.textAlign = 'center'
    this.print(text, this.width / 2, this.height / 2)
  }

  /**
   * Вывод текста по середине экрана с заданием y координаты
   * @param text текст сообщения
   * @param y позиция по y координате
   * */
  printByXCenter(text, y) {
    this.context.textAlign = 'center'
    this.print(text, this.width / 2, y)
  }

  /**
   * Вывод изображения по заданным координатам.
   * @param name наименования изображения {@link ImageType}
   * @param x позиция по x координате
   * @param y позиция по y координате
   * */
  drawImage(name, x = 0, y = 0) {
    const image = this.images[name]
    this.context.drawImage(image, x, y)
  }

  /**
   * Вывод изображения по центру экрана.
   * @param name наименования изображения {@link ImageType}
   * */
  drawImageByCenter(name) {
    const image = this.images[name]
    this.context.drawImage(image, this.width / 2 - image.width / 2, this.height / 2 - image.height / 2)
  }

  /**
   * Вывод спрайта на экран.
   * @param sprite спрайт {@link Sprite}
   * */
  drawSprite(sprite) {
    const image = this.images[sprite.imageName]

    if (sprite.angle) {
      // Если задан угол, то поворачиваем изображением
      this.context.save()
      this.context.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2)
      this.context.rotate(sprite.angle)
      this.context.translate(-(sprite.x + sprite.width / 2), -(sprite.y + sprite.height / 2))
    }

    this.context.drawImage(image,
      sprite.sourceX, sprite.sourceY, sprite.width, sprite.height,
      sprite.x, sprite.y, sprite.width, sprite.height)

    if (sprite.angle) {
      this.context.restore()
    }
  }
}