import FontFaceObserver from 'fontfaceobserver'

import { Game } from './game'
import './styles/styles.css'

window.onload = () => {
  // Загрузка шрифта
  const font = new FontFaceObserver('04b19')
  font.load().then(() => {
    // Создаем игру
    const flappyBird = new Game()
    // Запускаем игру, которая вызывает колбэк, когда она будет загружена
    flappyBird.run(() => {
      // Отображаем блок управления игрой и версию приложения
      const version = document.getElementById('version')
      version.appendChild(document.createTextNode(__APP_VERSION__))

      const help = document.getElementById('help')
      help.innerHTML = `<p>m - menu</p>
        <p>p - pause</p>
        <p>n - new game</p>
        <p>space/mouse click - flap</p>`
    })
  })
}