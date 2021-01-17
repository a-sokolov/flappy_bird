import { ImageType, AudioType } from './interfaces'

export const GAME_DEFINITION = {
  width: 288,
  height: 512,
  font: {
    size: '22px',
    name: '04b19'
  }
}

// Кол-во точек при загрузке
export const LOADING_DOT_COUNT = 3
// Время анимации точек при загрузке
export const SHOW_LOADING_TIMEOUT = 200
// Минимальное ожидание загрузки (чтобы не мигало)
export const LOADING_PROGRESS_TIMEOUT = 700
// Позиция пола
export const FLOOR_Y_POSITION = GAME_DEFINITION.height - 65
export const BIRD_X_POSITION = 30
export const BIRD_FLAP_TIME = 200
export const BIRD_PENDING_Y_GAP = 7
export const BIRD_PENDING_STEP = 0.5
// Скорость игры
export const GAME_SPEED = 2
// Гравитация
export const GAME_GRAVITY = 0.35
// Высота прыжка
export const BIRD_JUMP_POINTS = 6
// Коэффициент поворота картинки
export const ROTATE_IMAGE_RATIO = 0.09
// Угол, при котором птичка смотрит вниз
export const MAX_ANGLE = 1.5
// Позиция отрисовки следующей трубы
export const NEXT_PIPE_POINT = 96
// Расстояние между верхней и нижней трубой
export const PIPE_SPACE_BETWEEN = 110
// Минимальное высота верхней трубы
export const TOP_PIPE_MINIMUM_HEIGHT = 30

export const IMAGES = {
  [ImageType.backgroundDay]: './assets/img/background-day.png',
  [ImageType.backgroundNight]: './assets/img/background-night.png',
  [ImageType.floor]: './assets/img/floor.png',
  [ImageType.gameOver]: './assets/img/game-over.png',
  [ImageType.pipeBottom]: './assets/img/pipe-bottom.png',
  [ImageType.pipeTop]: './assets/img/pipe-top.png',
  [ImageType.menu]: './assets/img/menu.png',
  [ImageType.bird]: './assets/img/bird.png'
}

export const TILES = {
  [ImageType.bird]: {
    imageName: ImageType.bird,
    imageWidth: 102,
    imageHeight: 78,
    spriteWidth: 34,
    spriteHeight: 26
  }
}

export const AUDIOS = {
  [AudioType.fail]: './assets/audio/fail.mp3',
  [AudioType.flap]: './assets/audio/flap.mp3',
  [AudioType.gameOver]: './assets/audio/game-over.mp3',
  [AudioType.jump]: './assets/audio/jump.mp3',
  [AudioType.score]: './assets/audio/score.mp3',
  [AudioType.highScore]: './assets/audio/high-score.mp3'
}