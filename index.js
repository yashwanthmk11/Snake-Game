const CELL_WIDTH = 20
const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
const ROWS = CANVAS_WIDTH / CELL_WIDTH
const COLS = CANVAS_HEIGHT / CELL_WIDTH

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.score = 0
    this.snake = new Snake(this.ctx)
    this.food = new Food(this.ctx)
    this.interval = null
  }

  start() {
    this.snake.draw()
    this.food.draw(this.snake)
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case 37: {
        // left
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.snake.move(
            -CELL_WIDTH,
            0,
            this.checkCollision.bind(this),
            this.food
          )
        }, 100)
        break
      }
      case 38: {
        // up
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.snake.move(
            0,
            -CELL_WIDTH,
            this.checkCollision.bind(this),
            this.food
          )
        }, 100)
        break
      }
      case 39: {
        // right
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.snake.move(
            CELL_WIDTH,
            0,
            this.checkCollision.bind(this),
            this.food
          )
        }, 100)
        break
      }
      case 40: {
        // down
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.snake.move(
            0,
            CELL_WIDTH,
            this.checkCollision.bind(this),
            this.food
          )
        }, 100)
        break
      }
    }
  }

  checkCollision(updatedCoords) {
    // Check collision with food
    if (updatedCoords.x === this.food.x && updatedCoords.y === this.food.y) {
      this.score++
      return true
    }

    // Check collision with walls
    if (
      updatedCoords.x === 0 - CELL_WIDTH ||
      updatedCoords.x === CANVAS_WIDTH ||
      updatedCoords.y === 0 - CANVAS_WIDTH ||
      updatedCoords.y === CANVAS_HEIGHT
    ) {
      clearInterval(this.interval)
      alert("Game Over. Score: " + this.score)
    }

    return false
  }
}

class Snake {
  constructor(ctx) {
    this.ctx = ctx
    this.body = [{ x: 0, y: 0 }]
  }

  draw() {
    this.body.forEach(({ x, y }) => {
      this.ctx.fillStyle = "rgba(92, 229, 250)"
      this.ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH)
    })
  }

  clear() {
    this.body.forEach(({ x, y }) => {
      this.ctx.clearRect(x, y, CELL_WIDTH, CELL_WIDTH)
    })
  }

  move(dx, dy, checkCollision, food) {
    this.clear()
    let collisionWithFood = false

    const updatedBody = this.body.map(({ x, y }, index) => {
      if (index === 0) {
        const updatedCoords = { x: x + dx, y: y + dy }

        collisionWithFood = checkCollision(updatedCoords)

        return updatedCoords
      } else {
        const prevCell = this.body[index - 1]
        return {
          x: prevCell.x,
          y: prevCell.y,
        }
      }
    })

    if (collisionWithFood) {
      updatedBody.push({ ...this.body.pop() })
    }

    this.body = [...updatedBody]

    this.draw()

    if (collisionWithFood) {
      food.draw(this)
    }
  }
}

class Food {
  constructor(ctx) {
    this.ctx = ctx
  }

  draw(snake) {
    let isOverlapping = false
    let x
    let y

    do {
      x = Math.floor(Math.random() * (ROWS - 1)) * CELL_WIDTH
      y = Math.floor(Math.random() * (COLS - 1)) * CELL_WIDTH

      isOverlapping = snake.body.some(
        (bodyPart) => bodyPart.x === x && bodyPart.y === y
      )
    } while (isOverlapping)

    this.x = x
    this.y = y
    this.ctx.fillStyle = "#EF2D56"
    this.ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH)
  }
}

document.getElementById("start").addEventListener("click", () => {
  const game = new Game()
  game.start()

  document.addEventListener("keydown", (event) => game.handleKeyDown(event))
})