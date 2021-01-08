const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

// Картинки
const images = {
  bird: new Image(),
  bg_day: new Image(),
  bg_night: new Image(),
  fg: new Image(),
  pipeTop: new Image(),
  pipeBottom: new Image(),
  gameOver: new Image()
}

const BirdColors = ['yellow', 'blue', 'red']
const birdColor = BirdColors[Math.floor(Math.random() * BirdColors.length)]

images.bird.src = `assets/${birdColor}_bird.png`
images.bg_day.src = 'assets/background_day.png'
images.bg_night.src = 'assets/background_night.png'
images.fg.src = 'assets/base.png'
images.pipeTop.src = 'assets/pipe_top.png'
images.pipeBottom.src = 'assets/pipe_bottom.png'
images.gameOver.src = 'assets/game_over.png'

// Звуки
const sounds = {
  jump: new Audio(),
  score: new Audio(),
  gameOver: new Audio(),
  crash: new Audio()
}

sounds.jump.src = 'assets/jump.mp3'
sounds.score.src = 'assets/score.mp3'
sounds.gameOver.src = 'assets/game_over.mp3'
sounds.crash.src = 'assets/crash.mp3'

// Флаг, что проигрываем аудио
const SOUND_ON = true
// Режим бога
const GOD_MODE_ON = false
// Клавиша прыжка - Space
const JUMP_EVENT_KEY = 32
// Клавиша паузы - P
const PAUSE_EVENT_KEY = 80
// Скорость игры
const SPEED = 2
// Гравитация
const GRAVITY = 0.35
// Кол-во мсек для перезагрузки страницы
const RELOAD_PAGE_AFTER = 1500
// Кол-во мсек для возврата в игру после паузы
const RESUME_GAME_AFTER_PAUSE = 500
// Коэффициент поворота картинки
const ROTATE_IMAGE_RATIO = 0.09
// Время смены времени суток в секундах
const CHANGE_TIMES_OF_DAY = 20

// Флаг, что игра остановлена и не нужно больше отрисовывать следующий фрейм
let isStopGame = false

// Y позиция пола
const FLOOR_Y_POSITION = cvs.height - 65
// Высота прыжка
const BIRD_JUMP_POINTS = 6
// X позиция птички
const BIRD_X_POSITION = 30
// Y позиция птички
const BIRD_Y_POSITION = cvs.height / 2
// Позиция отрисовки следующей трубы
const NEXT_PIPE_POINT = 96
// Расстояние между верхней и нижней трубой
const PIPE_SPACE_BETWEEN = 110
// Минимальное высота верхней трубы
const TOP_PIPE_MINIMUM_HEIGHT = 30

// Статусы игры
const GameStatus = {
  // идет
  running: 'running',
  // пауза
  paused: 'paused',
  // ожидает
  pending: 'pending'
}

Object.freeze(GameStatus)

const game = {
  // Текущая позиция птички по Y координате
  birdYPos: BIRD_Y_POSITION,
  // Следующее движение птички
  birdMovement: 0,
  // Кол-во очков
  score: 0,
  // Текущий статус
  status: GameStatus.pending,
  // Массив труб
  pipes: [],
  // Идентификатор последнего фрейма
  animationId: 0,
  // Флаг, что игра проиграна
  isGameOver: false,
  // X координата пола
  floorXPos: 0
}

// Функция для остановки проигрывания аудио трека
const stopAudio = (audio) => {
  audio.pause()
  audio.currentTime = 0
}

// Функция дя проигрывания аудио трека с принудительной остановкой
const playAudio = (audio) => {
  SOUND_ON && stopAudio(audio)
  SOUND_ON && audio.play()
}

// Остановка игры путем прекращения отрисовки анимации
const stopGame = () => {
  cancelAnimationFrame(game.animationId)
  game.animationId = 0
}

// Функция для отображения полученных игровых очков
const showScore = (score) => {
  ctx.fillStyle = '#000'
  ctx.font = '20px Verdana'
  ctx.textAlign = 'left'
  ctx.fillText(`Score: ${score}`, 10, cvs.height - 15)
}

// Функция для паузы игры
const pauseGame = () => {
  ctx.fillStyle = '#000'
  ctx.font = '24px Verdana'
  ctx.textBaseline = 'center'
  ctx.textAlign = 'center'
  ctx.fillText('Pause', cvs.width / 2, cvs.height / 2)

  stopGame()
}

// Функция для возобновления игры после паузы
const resumeGame = () => {
  game.animationId = requestAnimationFrame(doAnimation)
}

// Отрисовка "Конец игры"
const drawGameOver = () => {
  playAudio(sounds.gameOver)

  const { gameOver } = images
  ctx.drawImage(gameOver, cvs.width / 2 - gameOver.width / 2, cvs.height / 2 - gameOver.height)
}

// Запуск анимации, когда игрок проиграл (птичка падает вниз)
const gameOverAnimation = (callback) => {
  const { bird } = images

  if (game.birdYPos + bird.height >= FLOOR_Y_POSITION) {
    // Как только птичка коснулась пола, то вызываем колбэк
    game.birdYPos = FLOOR_Y_POSITION - bird.height
    ctx.drawImage(bird, BIRD_X_POSITION, game.birdYPos)
    callback && callback()
  } else {
    // Если еще не коснулись пола, то отрисовываем анимацию птицы.
    // А т.к. движение игры остановлено, птица под силой гравитации будет падать вниз, в точке,
    // где коснулась препятствия
    drawBird()
  }
}

// Функция для чтения текущей скорости, если игра проиграна, то возвращаем 0
const getSpeed = () => {
  return game.isGameOver ? 0 : SPEED;
}

// Функция для поворота картинки
const rotatedDrawImage = (image, fromX, fromY, angle) => {
  ctx.save();
  ctx.translate(fromX + image.width / 2, fromY + image.height / 2);
  ctx.rotate(angle);
  ctx.translate(-(fromX + image.width / 2), -(fromY + image.height / 2));
  ctx.drawImage(image, fromX, fromY)
  ctx.restore()
}

// Функция для отрисовки птички
const drawBird = () => {
  const {status} = game;
  const {bird} = images

  if (status !== GameStatus.pending) {
    // Если не в ожидании, то к движению прибавляем гравитацию
    game.birdMovement += GRAVITY
    // Инициализируем Y позицию
    game.birdYPos += game.birdMovement
    if (game.birdYPos + bird.height > FLOOR_Y_POSITION) {
      // Если Y позиция ниже "пола", то птичка остается на уровне
      game.birdYPos = FLOOR_Y_POSITION - bird.height
    }
  }
  rotatedDrawImage(images.bird, BIRD_X_POSITION, game.birdYPos, game.birdMovement * ROTATE_IMAGE_RATIO)
}

// Функция для отрисовки движения пола
const drawFloor = () => {
  const { fg } = images

  game.floorXPos -= getSpeed()
  ctx.drawImage(fg, game.floorXPos, FLOOR_Y_POSITION)
  if (game.floorXPos <= cvs.width - fg.width) {
    // Как только X позиция "уедет за экран", то сразу сбрасываем на 0, для имитации бесконечного движения
    game.floorXPos = 0
  }
}

// Функция для создания создания верхней и нижней трубы
const createPipe = () => {
  const { pipeTop } = images

  const top = {
    x: cvs.width,
    // Y позиция вычисляется случайным образом
    y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
  }

  // Вычисляем дельту высоты верхней трубы
  const delta = pipeTop.height + top.y
  if (delta < TOP_PIPE_MINIMUM_HEIGHT) {
    // Если она меньше константы, то добавляем разницу (чтобы верхний край не обрезался)
    top.y += TOP_PIPE_MINIMUM_HEIGHT - delta
  }

  const bottom = {
    x: cvs.width,
    y: top.y + pipeTop.height + PIPE_SPACE_BETWEEN
  }

  return { top, bottom }
}

// Функция для отрисовки движения труб
const drawPipes = (pipes, callback) => {
  const { pipeTop, pipeBottom } = images

  pipes.forEach((pipe) => {
    const { top, bottom } = pipe

    ctx.drawImage(pipeTop, top.x, top.y)
    ctx.drawImage(pipeBottom, bottom.x, bottom.y)

    top.x -= getSpeed()
    bottom.x -= getSpeed()

    if (top.x === NEXT_PIPE_POINT) {
      // Как только X позиция трубы доходит до отметки, создаем новую пару
      pipes.push(createPipe())
    }

    callback && callback(pipe)
  })
}

// Проверка, что квадрат птички пересекает игровые поверхности (трубы, пол)
const checkCollision = (pipes) => {
  const { birdYPos } = game
  const { pipeTop, pipeBottom, bird } = images

  return pipes.some((pipe) => {
    const { top, bottom } = pipe

    const birdRect = { x: BIRD_X_POSITION, y: birdYPos, width: bird.width, height: bird.height }
    const topRect = { x: top.x, y: top.y, width: pipeTop.width, height: pipeTop.height }
    const bottomRect = { x: bottom.x, y: bottom.y, width: pipeBottom.width, height: pipeBottom.height }

    return checkRectCollision(birdRect, topRect) || checkRectCollision(birdRect, bottomRect)
  }) || FLOOR_Y_POSITION <= (birdYPos + bird.height)
}

const checkRectCollision = (rect1, rect2) => {
  return (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y)
}

let dayTimer = 0
let backgroundImage = images.bg_day

// Запускаем интервал, который будет прибавлять +1 секунду к игровому времени
setInterval(() => {
  const {status, isGameOver} = game
  if (status !== GameStatus.pending && status !== GameStatus.paused && !isGameOver) {
    dayTimer++
  }
}, 1000)

// Функция для отрисовки кадра анимации
const doAnimation = (timestamp) => {
  let pauseAfterAll = false
  const {bg_day, bg_night, pipeTop} = images
  const {pipes, status} = game

  if (dayTimer >= CHANGE_TIMES_OF_DAY) {
    dayTimer = 0
    backgroundImage = backgroundImage === bg_day ? bg_night : bg_day
  }

  // Рисуем фон
  ctx.drawImage(backgroundImage, 0, 0)

  if (status !== GameStatus.pending) {
    drawPipes(pipes, (pipe) => {
      if ((pipe.top.x + pipeTop.width) === BIRD_X_POSITION) {
        // Если X позиция птички дальше трубы, то прибавляем 1 очко
        game.score++
        playAudio(sounds.score)
      }
    })

    if (checkCollision(pipes) && !GOD_MODE_ON) {
      if (!game.isGameOver) {
        playAudio(sounds.crash)
        game.isGameOver = true
        pauseAfterAll = true
      }
    }

    if (pipes[0].top.x + pipeTop.width < 0) {
      // Как только пара труб ушла за границу экрана, то удаляем её из массива, т.к. она больше не нужна
      game.pipes.shift()
    }
  }

  // Рисуем пол
  drawFloor()
  // Отображаем очки
  showScore(game.score)

  if (pauseAfterAll) {
    // Если необходима пауза
    drawBird()
    stopGame()
    setTimeout(() => resumeGame(), RESUME_GAME_AFTER_PAUSE)
  } else {
    if (game.isGameOver) {
      // Если игрок проиграл, то рисуем анимацию "падения птички до пола"
      gameOverAnimation(() => {
        // Как только птичка упала, то показываем лейбл окончания игры
        drawGameOver()
        // Останавливаем игру (отменяем анимацию)
        stopGame()
        isStopGame = true

        // Через заданное время перегружаем страницу
        setTimeout(() => location.reload(), RELOAD_PAGE_AFTER)
      })
    } else {
      // Рисуем птичку
      !isStopGame && drawBird()
    }

    if (!isStopGame) {
      // Запрос на следующий кадр
      game.animationId = requestAnimationFrame(doAnimation)
    }
  }
}

// Как только загрузится последняя картинка, запускаем анимацию
images.pipeTop.onload = () => {
  // Создаем первую пару труб
  game.pipes.push(createPipe())
  game.animationId = requestAnimationFrame(doAnimation)
}

// Функция для прослушки нажатия клавиш
const keydownListener = (event) => {
  const { status, isGameOver, birdYPos } = game;

  if (!isGameOver) {
    if (event.which === JUMP_EVENT_KEY && status !== GameStatus.paused) {
      // Если нажата клавиша прыжка и игра не стоит на паузе, то присваиваем статус "идет"
      game.status = GameStatus.running

      if (birdYPos + BIRD_JUMP_POINTS + GRAVITY > 0) {
        // Если Y позиция птички + прыжок + гравитация > 0, то добавляем к позиции прыжок.
        // Иначе, ничего не происходит, чтобы птица не вылетала вверх за пределы экрана
        game.birdMovement = 0
        game.birdMovement -= BIRD_JUMP_POINTS
      }

      playAudio(sounds.jump)
    }

    if (event.which === PAUSE_EVENT_KEY && status !== GameStatus.pending) {
      // Если нажали паузу и игра не в ожидании, то меняем статус между "идет" и "пауза"
      game.status = status === GameStatus.paused ? GameStatus.running : GameStatus.paused

      game.status === GameStatus.running && resumeGame()
      game.status === GameStatus.paused && pauseGame()
    }
  }
}

document.addEventListener('keydown', keydownListener)