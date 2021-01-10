import { ImageType, AudioType } from './interfaces'

export const PROGRESS_DOT_COUNT = 3
export const SHOW_PROGRESS_TIMEOUT = 200
export const LOADING_PROGRESS_TIMEOUT = 1500
export const BIRD_X_POSITION = 30
export const BIRD_FLAP_TIME = 200
export const BIRD_PENDING_Y_GAP = 7
export const BIRD_PENDING_STEP = 0.5

export const GAME_DEFINITION = {
  width: 288,
  height: 512,
  font: {
    size: '22px',
    name: '04b19'
  }
}

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

export const AUDIOS = {
  [AudioType.fail]: './assets/audio/fail.mp3',
  [AudioType.flap]: './assets/audio/flap.mp3',
  [AudioType.gameOver]: './assets/audio/game-over.mp3',
  [AudioType.jump]: './assets/audio/jump.mp3',
  [AudioType.score]: './assets/audio/score.mp3'
}