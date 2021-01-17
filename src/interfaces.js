// Горячие клавиши
const __HotKeys = {
  jump: 'jump',
  pause: 'pause',
  restart: 'restart',
  menu: 'menu'
}

// Аудио
const __AudioType = {
  fail: 'fail',
  flap: 'flap',
  gameOver: 'gameOver',
  jump: 'jump',
  score: 'score',
  highScore: 'highScore',
  background: 'background'
}

// Картинки
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

// События
const __EventType = {
  gameOver: 'gameOver',
  jump: 'jump',
  fail: 'fail',
  score: 'score',
  highScore: 'highScore',
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  pause: 'pause',
  resume: 'resume'
}

export const HotKeys = Object.freeze(__HotKeys)
export const AudioType = Object.freeze(__AudioType)
export const ImageType = Object.freeze(__ImageType)
export const EventType = Object.freeze(__EventType)