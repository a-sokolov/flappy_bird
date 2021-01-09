export class AudioLoader {
  constructor(audioFiles) {
    this.audioFiles = audioFiles
    this.audios = {}
  }

  load() {
    for(let name in this.audioFiles) {
      this.loadAudio(name, this.audioFiles[name])
    }
    return Object.keys(this.audioFiles)
  }

  loadAudio(name, src) {
    const audio = new Audio()
    audio.src = src
    this.audios[name] = audio
  }
}