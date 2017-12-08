import Phaser from 'phaser'
import Brick from '../prefabs/Brick'
import Paddle from '../prefabs/Paddle'
import Ball from '../prefabs/Ball'
import Fire from '../prefabs/Fire'

export default class extends Phaser.State {
    constructor() {
        super()

        this.ballOnPaddle = true
    }

  init () {}
  preload () {}

  create () {
    this.game.physics.arcade.checkCollision.down = false

    this.setUpBG()
    this.setUpText()

    this.setUpBricks()
    this.setUpPaddle()
    this.setUpBall()



    this.game.input.onDown.add(this.releaseBall, this)
  }

  releaseBall () {
        if (!this.ballOnPaddle) {
            return
        }

        this.ballOnPaddle = false

      function randNumber() {
          let sign = Math.random()
          let number = Math.floor(Math.random() * 20)

          if (sign > 0.5) return 0-number
          else return number
      }

        this.ball.body.velocity.x = randNumber()

      //console.log(this.ball.body.velocity.x)

        this.ball.body.velocity.y = (-300 - (100 * this.game.global.level - 100))
  }
  setUpBall() {
      this.ball = new Ball(this.game)

      this.game.add.existing(this.ball)

      this.ball.events.onOutOfBounds.add(this.ballLost, this)

      this.putBallOnPaddle()
  }

  ballLost () {
    --this.game.global.lives

      if (this.game.global.lives === 0) {
        this.endGame()
          return
      }

      this.livesText.text = `Lives: ${this.game.global.lives}`

      this.putBallOnPaddle()
  }

  endGame () {
        this.game.state.start('Gameover')
  }

  putBallOnPaddle() {
    this.ballOnPaddle = true
    this.ball.reset(this.paddle.body.x, this.paddle.y - this.paddle.body.height)
  }

  setUpPaddle() {
      this.paddle = new Paddle(
          this.game,
          this.game.world.centerX,
          this.game.world.height - 200
      )

      this.game.add.existing(this.paddle)
  }

  setUpBricks() {
      this.bricks = this.game.add.group()

      this.generateBricks(this.bricks)
  }

  generateBricks (bricksGroup) {
      let rows = 5
      let columns = this.game.width/80
      let xOffset = 50
      let yOffset = 45
      let brick

      for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
              brick = new Brick(
                  this.game,
                  x * xOffset,
                  y * yOffset
              )

              bricksGroup.add(brick)
          }
      }

      let brickGroupWidth = ((xOffset * columns) - (xOffset - brick.width))/2

      bricksGroup.position.setTo(
          this.game.world.centerX - brickGroupWidth,
          this.game.world.centerY - 250
      )
  }

  setUpText () {
      this.scoreText = this.createText(20,20,'left',`Score: ${this.game.global.score}`)
      this.livesText = this.createText(0,20,'center',`Lives: ${this.game.global.lives}`)
      this.levelText = this.createText(-20,20,'right',`Level: ${this.game.global.level}`)
  }

  createText (xOffset, yOffset, align, text) {

      return this.game.add.text(
          xOffset,
          yOffset,
          text,
          {
            font: '24px VT323',
            fill: '#eee',
            boundsAlignH: align
          }
      ).setTextBounds(0,0, this.game.world.width, 0)
  }

  setUpBG () {
        this.bg = this.game.add.group()

        this.generateFire(this.bg)
  }

  generateFire(bg) {
      let rows = 1
      let columns = 15
      let xOffset = 200
      let yOffset = this.game.height
      let fire

      for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
              fire = new Fire(
                  this.game,
                  x * xOffset,
                  y * yOffset
              )

              bg.add(fire)
          }
      }

      let bgWidth = ((xOffset * columns) - (xOffset - fire.width))/2

      bg.position.setTo(
          this.game.world.centerX - bgWidth,
          this.game.world.bottom + 400
      )
  }

  update () {
    if (this.ballOnPaddle) {
        this.ball.body.x = this.paddle.x - (this.ball.width / 2)
    }

    this.game.physics.arcade.collide(
        this.ball,
        this.paddle,
        this.ballHitPaddle,
        null,
        this
    )

    this.game.physics.arcade.collide(
      this.ball,
      this.bricks,
      this.ballHitBrick,
      null,
      this
    )
  }

  ballHitBrick (ball, brick) {
        brick.kill()

      ball.body.velocity.y += 10
      this.game.global.score += 10
      this.scoreText.text = `Score: ${this.game.global.score}`

      if (this.bricks.countLiving() > 0) {
            return
      }

      this.game.global.level += 1
      this.levelText.text = `Level: ${this.game.global.level}`

      this.putBallOnPaddle()
      this.generateBricks(this.bricks)
  }

  ballHitPaddle (ball, paddle) {
    let diff = 0

      if (ball.x < paddle.x) {
            diff = paddle.x - ball.x
            ball.body.velocity.x = (-10 * diff)
            return
      }

      if (ball.x > paddle.x) {
            diff = ball.x - paddle.x
            ball.body.velocity.x = (10 * diff)
            return
      }
  }

  render () {

  }
}
