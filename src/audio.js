import { AudioLoader } from './audio-loader'

export class Audio {
  constructor() {
    this.audios = {}
  }

  loadAudio(audioFiles) {
    const loader = new AudioLoader(audioFiles)
    const names = loader.load()
    this.audios = Object.assign(this.audios, loader.audios)
    console.log(names)
  }

  play(name) {
    const audio = this.audios[name]
    audio.pause()
    audio.currentTime = 0
    return audio.play()
  }
}