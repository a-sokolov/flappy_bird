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

  /** Проигрывание аудио по его имени с предварительной остановкой текущего */
  play(name, stop = true) {
    const audio = this.audios[name]

    if (stop) {
      audio.pause()
      audio.currentTime = 0
    }
    return audio.play()
  }
}