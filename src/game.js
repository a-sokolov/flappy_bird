const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

const images = {
  bird: new Image(),
  bg: new Image(),
  fg: new Image(),
  pipeTop: new Image(),
  pipeBottom: new Image(),
  gameOver: new Image()
}

images.bird.src = 'assets/bird.png'
images.bg.src = 'assets/bg.png'
images.fg.src = 'assets/base.png'
images.pipeTop.src = 'assets/pipe_top_alt.png'
images.pipeBottom.src = 'assets/pipe_bottom_alt.png'
images.gameOver.src = 'assets/game_over.png'

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

const SOUND_ON = true
const JUMP_EVENT_KEY = ' '
const PAUSE_EVENT_KEY = 'p'
const SPEED = 2

let gravity = 0.35
let isStopGame = false

const FLOOR_Y_POSITION = cvs.height - 65
const BIRD_JUMP_POINTS = 6
const BIRD_Y_POSITION = cvs.height / 2
const BIRD_X_POSITION = 30
const NEXT_PIPE_POINT = 96
const PIPE_SPACE_BETWEEN = 110

const GameStatus = {
  running: 'running',
  paused: 'paused',
  pending: 'pending'
}

Object.freeze(GameStatus)

const game = {
  birdYPos: BIRD_Y_POSITION,
  birdMovement: 0,
  scores: 0,
  status: GameStatus.pending,
  pipes: [],
  animationId: 0,
  isGameOver: false,
  floorXPos: 0
}

game.pipes.push({
  x: cvs.width,
  y: 0
})

const stopAudio = (audio) => {
  audio.pause()
  audio.currentTime = 0
}

const playAudio = (audio) => {
  SOUND_ON && stopAudio(audio)
  SOUND_ON && audio.play()
}

const stopGame = () => {
  cancelAnimationFrame(game.animationId)
  game.animationId = 0
}

const showScores = (scores) => {
  ctx.fillStyle = '#000'
  ctx.font = '20px Verdana'
  ctx.textAlign = 'left'
  ctx.fillText(`Scores: ${scores}`, 10, cvs.height - 20)
}

const pauseGame = () => {
  ctx.fillStyle = '#000'
  ctx.font = '24px Verdana'
  ctx.textBaseline = 'center'
  ctx.textAlign = 'center'
  ctx.fillText('Pause', cvs.width / 2, cvs.height / 2)

  stopGame()
}

const resumeGame = () => {
  game.animationId = requestAnimationFrame(draw)
}

const drawGameOver = () => {
  playAudio(sounds.gameOver)

  const { gameOver } = images
  ctx.drawImage(gameOver, cvs.width / 2 - gameOver.width / 2, cvs.height / 2 - gameOver.height)
}

const gameOverAnimation = (callback) => {
  const { bird } = images

  if (game.birdYPos + bird.height > FLOOR_Y_POSITION) {
    game.birdYPos = FLOOR_Y_POSITION - bird.height
    ctx.drawImage(bird, BIRD_X_POSITION, game.birdYPos)
    callback && callback()
  } else {
    drawBird()
  }
}

const getSpeed = () => {
  return game.isGameOver ? 0 : SPEED;
}

const drawBird = () => {
  const { status } = game;

  if (status !== GameStatus.pending) {
    game.birdMovement += gravity
    game.birdYPos += game.birdMovement
  }

  ctx.drawImage(images.bird, BIRD_X_POSITION, game.birdYPos)
}

const drawFloor = () => {
  const { fg } = images

  game.floorXPos -= getSpeed()
  ctx.drawImage(fg, game.floorXPos, FLOOR_Y_POSITION)
  if (game.floorXPos <= cvs.width - fg.width) {
    game.floorXPos = 0
  }
}

const drawPipes = (pipes, callback) => {
  const { pipeTop, pipeBottom } = images

  pipes.forEach((pipe) => {
    ctx.drawImage(pipeTop, pipe.x, pipe.y)
    ctx.drawImage(pipeBottom, pipe.x, pipe.y + pipeTop.height + PIPE_SPACE_BETWEEN)

    pipe.x -= getSpeed()

    if (pipe.x === NEXT_PIPE_POINT) {
      pipes.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
      })
    }

    callback && callback(pipe)
  })
}

const checkCollision = (pipes) => {
  const { birdYPos } = game
  const { pipeTop, bird } = images

  return pipes.some((pipe) => {
    const rect1 = { x: BIRD_X_POSITION, y: birdYPos, width: bird.width, height: bird.height }
    const rect2 = { x: pipe.x, y: pipe.y, width: pipeTop.width, height: pipeTop.height }

    return checkRectCollision(rect1, rect2)
  })
}

const checkRectCollision = (rect1, rect2) => {
  return (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y)
}

const draw = () => {
  const { bg, pipeTop, bird } = images
  const { pipes, birdYPos, scores, status } = game

  ctx.drawImage(bg, 0, 0)

  if (status !== GameStatus.pending) {
    drawPipes(pipes, (pipe) => {
      // const rect1 = { x: BIRD_X_POSITION, y: birdYPos, width: bird.width, height: bird.height }
      // const rect2 = { x: pipe.x, y: pipe.y, width: pipeTop.width, height: pipeTop.height }

      // if (checkCollision(rect1, rect2)) {
      //   if (!game.isGameOver) {
      //     playAudio(sounds.crash)
      //     game.isGameOver = true
      //   }
      // }

      // if (BIRD_X_POSITION + bird.width >= pipe.x
      //   && BIRD_X_POSITION <= pipe.x + pipeTop.width
      //   && (birdYPos <= pipe.y + pipeTop.height
      //     || birdYPos + bird.height >= pipe.y + pipeTop.height + PIPE_SPACE_BETWEEN)
      //   || birdYPos + bird.height >= FLOOR_Y_POSITION) {
      //   if (!game.isGameOver) {
      //     playAudio(sounds.crash)
      //     game.isGameOver = true
      //   }
      // }

      if ((pipe.x + pipeTop.width) === BIRD_X_POSITION) {
        game.scores++
        playAudio(sounds.score)
      }
    })

    if (checkCollision(pipes)) {
      if (!game.isGameOver) {
        playAudio(sounds.crash)
        game.isGameOver = true
      }
    }

    if (pipes.find((pipe) => pipe.x + pipeTop.width < 0)) {
      game.pipes.shift()
    }
  }

  drawFloor()
  showScores(scores)

  if (game.isGameOver) {
    gameOverAnimation(() => {
      drawGameOver()
      stopGame()
      isStopGame = true

      setTimeout(() => location.reload(), 1500)
    })
  } else {
    !isStopGame && drawBird()
  }

  if (!isStopGame) {
    game.animationId = requestAnimationFrame(draw)
  }
}

images.pipeBottom.onload = draw

const keydownListener = (event) => {
  const { status, isGameOver, birdYPos } = game;

  if (!isGameOver) {
    if (event.key === JUMP_EVENT_KEY && status !== GameStatus.paused) {
      game.status = GameStatus.running

      if (birdYPos + BIRD_JUMP_POINTS + gravity > 0) {
        game.birdMovement = 0
        game.birdMovement -= BIRD_JUMP_POINTS
      }

      playAudio(sounds.jump)
    }

    if (event.key.toLowerCase() === PAUSE_EVENT_KEY && status !== GameStatus.pending) {
      game.status = status === GameStatus.paused ? GameStatus.running : GameStatus.paused

      game.status === GameStatus.running && resumeGame()
      game.status === GameStatus.paused && pauseGame()
    }
  }
}

document.addEventListener('keydown', keydownListener)