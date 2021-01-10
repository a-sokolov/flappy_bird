import { ImageType, AudioType } from './interfaces'

export const GAME_DEFINITION = {
  width: 288,
  height: 512
}

export const IMAGES = {
  [ImageType.backgroundDay]: './assets/img/background-day.png',
  [ImageType.backgroundNight]: './assets/img/background-night.png',
  [ImageType.blueBirdDownFlap]: './assets/img/bluebird-downflap.png',
  [ImageType.blueBirdMiddleFlap]: './assets/img/bluebird-midflap.png',
  [ImageType.blueBirdUpFlap]: './assets/img/bluebird-upflap.png',
  [ImageType.floor]: './assets/img/floor.png',
  [ImageType.gameOver]: './assets/img/game-over.png',
  [ImageType.pipeBottom]: './assets/img/pipe-bottom.png',
  [ImageType.pipeTop]: './assets/img/pipe-top.png',
  [ImageType.redBirdDownFlap]: './assets/img/redbird-downflap.png',
  [ImageType.redBirdMiddleFlap]: './assets/img/redbird-midflap.png',
  [ImageType.redBirdUpFlap]: './assets/img/redbird-upflap.png',
  [ImageType.yellowBirdDownFlap]: './assets/img/yellowbird-downflap.png',
  [ImageType.yellowBirdMiddleFlap]: './assets/img/yellowbird-midflap.png',
  [ImageType.yellowBirdUpFlap]: './assets/img/yellowbird-upflap.png',
  [ImageType.menu]: './assets/img/menu.png'
}

export const AUDIOS = {
  [AudioType.fail]: './assets/audio/fail.mp3',
  [AudioType.flap]: './assets/audio/flap.mp3',
  [AudioType.gameOver]: './assets/audio/game-over.mp3',
  [AudioType.jump]: './assets/audio/jump.mp3',
  [AudioType.score]: './assets/audio/score.mp3'
}