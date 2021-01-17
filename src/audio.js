import { AudioLoader } from './loaders/audio-loader'

/** Клас для хранения и проигрывания аудио */
export class Audio {
  constructor() {
    this.audios = {}
  }

  /** Метод для загрузки аудио-файлов */
  loadAudio(audioFiles) {
    const loader = new AudioLoader(audioFiles)
    const names = loader.load()
    this.audios = Object.assign(this.audios, loader.audios)
    console.log(names)
  }

  /** Метод для паузы аудио */
  pause(name) {
    const audio = this.audios[name]
    return audio.pause()
  }

  /** Проигрывание аудио по его имени с предварительной остановкой текущего */
  play(name, stop = true) {
    const audio = this.audios[name]

    stop && this.stop(name)
    return audio.play()
  }

  /** Метод для остановки проигрывания аудио */
  stop(name) {
    const audio = this.audios[name]
    audio.pause()
    audio.currentTime = 0
  }

  /** Метод для зацикливания аудио */
  loop(name) {
    const audio = this.audios[name]
    audio.loop = true
    return audio.play()
  }
}