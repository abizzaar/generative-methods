function getRandomInRange(int) {
  return Math.random() * int;
}

function getP5Element(index) {
  let element = document.getElementById("drawing" + index).getElementsByClassName("drawing-p5holder")[0]
  return element
}

//===========================================================

const WIDTH = 300
const HEIGHT = 300

// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Hello, animation!")

  // Rename your drawing here if you want
  let drawingTitles = ["Scissor man",
    "Spin the Bottle",
    "Why angle",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?"
  ]
  let mainElement = document.getElementById("main")

  // Ignore this section if you want
  // This is me adding a label and a canvas-holder to each swatch
  // For each drawing
  for (var i = 0; i < 3; i++) {
    let el = document.createElement("div")
    el.className = "drawing"
    el.id = "drawing" + i
    mainElement.append(el)

    // Add a label
    let label = document.createElement("div")
    label.className = "drawing-label"
    label.innerHTML = "Drawing #" + i + ":" + drawingTitles[i]
    el.append(label)

    // Add a div to hold the canvas (so we can resize it independently of the outer frame)
    let canvasHolder = document.createElement("div")
    canvasHolder.className = "drawing-p5holder"
    canvasHolder.style = `width:${WIDTH};height:${HEIGHT}`
    el.append(canvasHolder)
  }

  // Comment out these lines to not draw each
  quickDrawing()
  rotatingLine()
  triangleMorph()
});

function quickDrawing() {
  let morph = [WIDTH / 2, HEIGHT / 2]
  let destination = [morph[0] + getRandomInRange(50) - 25, morph[1] + getRandomInRange(50) - 25]
  let delta_factor = 4

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT)
    p.colorMode(p.HSL)
    p.background(0)
    // p.fill(0, 0, 100, 0.1)
    p.stroke(0, 0, 100, 0.1)
    p.strokeWeight(2)
  }

  function draw(p) {
    let y_delta = destination[1] - morph[1]
    let x_delta = destination[0] - morph[0]
    let slope = y_delta / x_delta

    let hypotenuse = Math.sqrt(Math.pow(y_delta, 2) + Math.pow(x_delta, 2))
    let unit_vector = [x_delta / hypotenuse, y_delta / hypotenuse]
    let vector = [unit_vector[0]*delta_factor, unit_vector[1]*delta_factor]
    // let delta = delta_factor * (destination[0] > morph[0] ? 1 : -1)

    // let x_change = Math.sqrt(Math.pow(delta, 2)/(1+Math.pow(slope, 2)))

    // let x_change = unit_vector
    // let y_change = slope*x_change

    morph = [morph[0]+vector[0], morph[1]+vector[1]]

    if (Math.abs(destination[0]-morph[0]) < 10) {
      const is_in_bounds = point =>
        point[0] > 0 && point[0] < p.width && point[1] > 0 && point[1] < p.height

      do {
        destination = [morph[0] + getRandomInRange(100) - 50, morph[1] + getRandomInRange(100) - 50]
      } while (!is_in_bounds(destination));
    }

    p.circle(morph[0], morph[1], 1)
  }

  let element = getP5Element(0) // My function to get the element for this index
  let myP5 = new p5(function (p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}

function rotatingLine() {
  let angle = 0


  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT)
    p.colorMode(p.HSL)
    p.background(0)
    // p.fill(0, 0, 100)
    p.stroke(0, 0, 100, 0.7)
    p.strokeWeight(2)
  }



  function draw(p) {
    p.background(0, 0, 0, 1)
    let t = p.millis() * .001

    let line_width = 71 + (70 * Math.sin(t * 0.5))

    let x1 = - (line_width / 2)
    let y1 = 0
    let x2 = x1 + line_width
    let y2 = 0

    p.translate(p.width / 2, p.height / 2)

    // Change rotation_change_speed after every rotation
    // if (t % (2 * Math.PI) === 0) {
    //   rotation_change_speed = getRandomInRange(5)
    // }

    let angle_delta = 0.1 * (Math.sin(t*0.5))

    angle += angle_delta

    p.rotate(angle)

    p.line(x1,y1,x2,y2)

  }

  let element = getP5Element(1) // My function to get the element for this index
  let myP5 = new p5(function (p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}

function triangleMorph() {
  let is_up_triangle = true
  let triangle_width = 170
  let tan_60 = 1.732
  let triangle_height = tan_60 * (triangle_width / 2)
  let radius = 1
  let mid_y = HEIGHT / 2
  let bottom_base = mid_y + (triangle_height / 2)
  let x_offset = (WIDTH - triangle_width) / 2
  let circle_increment = 1

  // Create x coordinates of triangle
  let triangle_x = []
  for (let i = 0; i < triangle_width; i += circle_increment) {
    let x = x_offset + i
    triangle_x.push(x)
    triangle_x.push(x)
  }

  // Create upward triangle
  let up_triangle_y = []

  for (let i = 0; i < triangle_width; i += circle_increment) {
    // base of triangle
    up_triangle_y.push(bottom_base)

    // cone of triangle
    if (i < triangle_width / 2) {
      up_triangle_y.push(bottom_base - (tan_60 * i))
    } else {
      up_triangle_y.push(bottom_base + (tan_60 * i) - (2 * triangle_height))
    }
  }

  // Create downward triangle
  let down_triangle_y = up_triangle_y.map(y => (2 * mid_y) - y)

  // Create current morphed state
  let morph_y = [...up_triangle_y]

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT)
    p.colorMode(p.HSL)
    p.background(0)
    // p.fill(0, 0, 100)
    p.stroke(0, 0, 100, 0.9)
    p.strokeWeight(1.7)
    for (let i = 0; i < triangle_x.length; i++) {
      p.circle(triangle_x[i], up_triangle_y[i], radius)
    }
  }

  function draw(p) {
    p.background(0)

    // let reached_dest = true
    let total_distance = 0
    for (let i = 0; i < triangle_x.length; i++) {
      let [src, dest] = is_up_triangle ? [up_triangle_y, down_triangle_y] : [down_triangle_y, up_triangle_y]
      let distance = Math.abs(morph_y[i] - dest[i])
      total_distance += distance

      let distance_pct = distance / Math.abs(src[i] - dest[i])

      let lerp_speed = getRandomInRange(0.1)

      morph_y[i] = p.lerp(morph_y[i], dest[i], lerp_speed)
      p.circle(triangle_x[i], morph_y[i], radius)
    }

    if (total_distance < 20) {
      is_up_triangle = !is_up_triangle
    }
  }

  let element = getP5Element(2) // My function to get the element for this index
  let myP5 = new p5(function (p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}

function paintSplatter() {
  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT)

    p.colorMode(p.HSL)

    p.background(0)
  }

  function draw(p) {

    if (p.frameCount % 10000 === 0) {
      let color = p.color(100, 100, 30)
      color.setAlpha(100)
      p.fill(color)
      let radius = getRandomInRange(25) + 25
      p.ellipse(getRandomInRange(p.width), getRandomInRange(p.height), radius, radius)
    }
  }

  let element = getP5Element(0) // My function to get the element for this index
  let myP5 = new p5(function (p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}
