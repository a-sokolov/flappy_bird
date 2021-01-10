import { Game } from './game'
import './styles/styles.css'

window.onload = () => {
  const flappyBird = new Game()
  flappyBird.run()
}