import FontFaceObserver from 'fontfaceobserver'

import { Game } from './game'
import './styles/styles.css'

window.onload = () => {
  const font = new FontFaceObserver('04b19')
  font.load().then(() => {
    const flappyBird = new Game()
    flappyBird.run()
  })
}