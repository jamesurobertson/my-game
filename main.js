
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

let heroX = canvas.width * 0.75
let heroY = canvas.height / 2
let enemyX = canvas.width * 0.25
let enemyY = canvas.height / 2
const enemyRadius = 10
const heroRadius = 10
let heroScore = 0
let enemyScore = 0
let targetX = canvas.width / 2
let targetY = canvas.height / 2
const target = 10
const heroSpeed = 4
const enemySpeed = 4

const Keys = {
  left: false,
  up: false,
  right: false,
  down: false,
  w: false,
  a: false,
  s: false,
  d: false
}

document.addEventListener('keyup', event => keyHandler(event, false))
document.addEventListener('keydown', event => keyHandler(event, true))

function keyHandler (event, bool) {
  const kc = event.keyCode

  if (kc === 37) Keys.left = bool
  if (kc === 38) Keys.up = bool
  if (kc === 39) Keys.right = bool
  if (kc === 40) Keys.down = bool
  if (kc === 65) Keys.a = bool
  if (kc === 87) Keys.w = bool
  if (kc === 68) Keys.d = bool
  if (kc === 83) Keys.s = bool
}

function detectCollision () {
  // Hero detection with border
  if (heroX > canvas.width) heroX = 0
  if (heroX < 0) heroX = canvas.width
  if (heroY > canvas.height) heroY = 0
  if (heroY < 0) heroY = canvas.height

  // Enemy Detection with border
  if (enemyX > canvas.width) enemyX = 0
  if (enemyX < 0) enemyX = canvas.width
  if (enemyY > canvas.height) enemyY = 0
  if (enemyY < 0) enemyY = canvas.height

  // hero detection with target
  const heroXC = heroX - targetX
  const heroYC = heroY - targetY
  const distance1 = Math.sqrt(heroXC * heroXC + heroYC * heroYC)

  if (distance1 < heroRadius + target) {
    targetX = Math.floor(Math.random() * 370) + 10
    targetY = Math.floor(Math.random() * 390) + 10
    heroScore++
  }
  // enemy detection with target
  const enemyXC = enemyX - targetX
  const enemyYC = enemyY - targetY
  const distance2 = Math.sqrt(enemyXC * enemyXC + enemyYC * enemyYC)

  if (distance2 < enemyRadius + target) {
    targetX = Math.floor(Math.random() * 370) + 10
    targetY = Math.floor(Math.random() * 390) + 10
    enemyScore++
  }
}

function movePlayers () {
  if (Keys.left) heroX -= heroSpeed
  if (Keys.right) heroX += heroSpeed
  if (Keys.up) heroY -= heroSpeed
  if (Keys.down) heroY += heroSpeed
  if (Keys.a) enemyX -= enemySpeed
  if (Keys.w) enemyY -= enemySpeed
  if (Keys.d) enemyX += enemySpeed
  if (Keys.s) enemyY += enemySpeed
}

function drawHero () {
  ctx.beginPath()
  ctx.arc(heroX, heroY, heroRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.closePath()
}

function drawEnemy () {
  ctx.beginPath()
  ctx.arc(enemyX, enemyY, enemyRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.closePath()
}

function drawTarget () {
  ctx.beginPath()
  ctx.arc(targetX, targetY, target, 0, Math.PI * 2)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.closePath()
}

function drawHeroScore () {
  ctx.font = '15px Helvetica'
  ctx.fillStyle = 'blue'
  ctx.fillText('Score: ' + heroScore, 530, 20)
}

function drawEnemyScore () {
  ctx.font = '15px Helvetica'
  ctx.fillStyle = 'red'
  ctx.fillText('Score: ' + enemyScore, 10, 20)
}

function checkGameOver () {
  if (heroScore === 20) {
    heroScore = 0
    enemyScore = 0
  } else if (enemyScore === 20) {
    heroScore = 0
    enemyScore = 0
  }
}

function clearCanvas () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function main () {
  clearCanvas()
  drawHero()
  drawEnemy()
  drawTarget()
  drawHeroScore()
  drawEnemyScore()
  checkGameOver()
  detectCollision()
  movePlayers()
}

setInterval(main
  , 1000 / 60)
