import { Game } from './game'
import './styles/styles.css'

window.onload = () => {
  const flappyBird = new Game({ width: 288, height: 512 })
  flappyBird.run()
}