const __HotKeys = {
  JUMP: 'JUMP',
  PAUSE: 'PAUSE',
  RESTART: 'RESTART',
  MENU: 'MENU'
}

const __AudioType = {
  fail: 'fail',
  flap: 'flap',
  gameOver: 'gameOver',
  jump: 'jump',
  score: 'score'
}

const __ImageType = {
  backgroundDay: 'backgroundDay',
  backgroundNight: 'backgroundNight',
  floor: 'floor',
  gameOver: 'gameOver',
  pipeBottom: 'pipeBottom',
  pipeTop: 'pipeTop',
  menu: 'menu',
  bird: 'bird'
}

export const HotKeys = Object.freeze(__HotKeys)
export const AudioType = Object.freeze(__AudioType)
export const ImageType = Object.freeze(__ImageType)