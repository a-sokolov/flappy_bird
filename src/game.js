import { Screen } from './screen'
import { Audio } from './audio'
import { Scene } from './scene'
import { Intervals } from './intervals'
import { ControlState } from './control-state'
import { Events } from './events'

import { IMAGES, AUDIOS, GAME_DEFINITION, GAME_SPEED } from './constants'
import { HotKeys, EventType } from './interfaces'

import { Loading } from './scenes/loading'
import { Menu } from './scenes/menu'
import { GameLevel } from './scenes/game-level'
import { GameOver } from './scenes/game-over'

/** Игровой класс */
export class Game {
  constructor(props = {}) {
    const { width = GAME_DEFINITION.width, height = GAME_DEFINITION.height } = props

    this.intervals = new Intervals()
    this.control = new ControlState()
    this.events = new Events(this)

    this.screen = new Screen(width, height)
    this.screen.loadImages(IMAGES)

    this.audio = new Audio()
    this.audio.loadAudio(AUDIOS)

    // Создаем основные сцены
    this.scenes = {
      // Загрузка
      loading: new Loading(this),
      // Меню
      menu: new Menu(this),
      // Игровой уровень
      gameLevel: new GameLevel(this),
      // Конец игры
      gameOver: new GameOver(this)
    }

    // Инициализируем текущую сцену (загрузка)
    this.setScene(this.scenes.loading)

    // Идентификатор текущего кадра анимации
    this.animationId = 0
    // Флаг, что установили игру на паузу
    this.isPause = false
    // Рекордные очки
    this.highScore = 0
    // Игровой таймер
    this.timer = {
      id: 0,
      time: 0
    }

    this.pause = this.pause.bind(this)
    this.menu = this.menu.bind(this)
    this.gameTimer = this.gameTimer.bind(this)

    // Подписываемся под нажатие горячих клавиш "Пауза" и "Меню"
    this.control.addListener(HotKeys.pause, this.pause)
    this.control.addListener(HotKeys.menu, this.menu)
  }

  /** Функция для отчета игрового времени */
  gameTimer() {
    if (this.currentScene instanceof GameLevel
        && this.currentScene.isWorking()
        && !this.isPause) {
      this.timer.time++
    }
  }

  runTimer() {
    clearInterval(this.timer.id)
    this.timer.time = 0

    this.timer.id = setInterval(this.gameTimer, 1000)
  }

  /**
   * Метод смены сцены
   * @param status статус игры {@link Scene}
   * @param props пропсы, которые можно передать в качестве параметра при инициализации сцены
   * */
  changeScene(status, props) {
    let scene
    switch (status) {
      case Scene.LOADED:
        // Вызываем колбэк, когда игра загружена
        this.callbackAfterLoading?.()
        scene = this.scenes.menu
        break
      case Scene.START_GAME:
      case Scene.NEW_GAME:
        scene = this.scenes.gameLevel
        break
      case Scene.GAME_OVER:
        scene = this.scenes.gameOver
        break
      default:
        scene = this.scenes.menu
    }

    // Определяем когда запускать или останавливать игровой таймер
    if ([Scene.START_GAME, Scene.NEW_GAME].includes(status)) {
      this.runTimer()
    }

    this.setScene(scene, props)
  }

  /**
   * Установка новой сцены.
   * @param scene сцена
   * @param props параметры для их передачи при инициализации
   * */
  setScene(scene, props) {
    this.currentScene?.destroy()
    this.currentScene = scene
    this.currentScene.init(props)
  }

  /** Ставим/снимаем на/с паузу, только если текущая сцена "Игровой уровень" */
  pause() {
    if (this.currentScene instanceof GameLevel) {
      this.isPause = !this.isPause

      if (this.isPause) {
        this.events.fireEvent(EventType.pause)
        this.screen.printByCenter('Pause')
      } else {
        this.events.fireEvent(EventType.resume)
      }

      this.isPause && this.stop()
      !this.isPause && this.run()
    }
  }

  /** Выводим меню, только если текущая сцена "Игровой уровень" */
  menu() {
    if (this.isPause) {
      return
    }

    if (this.currentScene instanceof GameLevel) {
      this.events.fireEvent(EventType.gameEnded)
      this.setScene(this.scenes.menu)
    }
  }

  /** Основной цикл игры */
  frame(time) {
    if (!this.currentScene.isWorking() && !this.currentScene.isPending()) {
      // Если статус текущей сцены не "В работе", то переходим к следующей с передачей пропсов
      const { status, props } = this.currentScene
      this.changeScene(status, props)
    }

    // Рендерим текущую сцену
    this.currentScene.render(time)
    // Проверяем заданные интервалы
    this.intervals.checkIntervals(time)
    // Запускаем следующий кард анимации
    this.animationId = requestAnimationFrame(time => this.frame(time))
  }

  /**
   * Метод для запуска игры.
   * @param callbackAfterLoading колбэк, вызываемый после загрузки игры */
  run(callbackAfterLoading) {
    this.animationId = requestAnimationFrame(time => this.frame(time))
    this.callbackAfterLoading = callbackAfterLoading
    this.runTimer()
  }

  /** Метод для остановки анимации */
  stop() {
    cancelAnimationFrame(this.animationId)
    this.animationId = 0
  }

  /** Метод для чтения игровой скорости */
  getSpeed() {
    return GAME_SPEED
  }

  /** Метод для чтения текущего игрового времени */
  getTime() {
    return this.timer.time
  }

  /**
   * Метод для проверки рекордных очков.
   * @param score текущие очки игрока */
  setHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score
    }
  }
}