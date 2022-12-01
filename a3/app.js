const DRAW_INTERVAL_DURATION = 30
const SIDEBAR_WIDTH = 100

let drawInterval, currentX, currentY, selectedIcon
let shouldDrawSplatter = false
let isDrawing = false
let iconSize = 100

let icons = [
  {
    name: "heart-outline",
    color: "red"
  },
  {
    name: "skull-outline",
    color: "blue"
  },
  {
    name: "flash-outline",
    color: "yellow"
  },
  {
    name: "musical-notes-outline",
    color: "black"
  },
  {
    name: "airplane-outline",
    color: "black"
  },
  {
    name: "football-outline",
    color: "purple"
  },
  {
    name: "man-outline",
    color: "blue"
  },
  {
    name: "woman-outline",
    color: "pink"
  }
]

let sidebar = document.getElementById("sidebar")
let canvas = document.getElementById("canvas")
let body = document.getElementById("body")

renderIcons()
selectNewIcon(icons[0]["name"])


// let sizeEl = document.getElementById("sizeDisplay")

let baseColor, colors
changeColors()

let cursor
createCursor()

changeSize(30)
paintSplatter()

document.addEventListener('mousedown', e => {
  // if (e.target.id === "canvas" || e.target.style.position === "absolute") {
  if (e.clientX > SIDEBAR_WIDTH && e.which === 1) {
    drawSvg()
    isDrawing = true
    drawInterval = setInterval(() => {
      drawSvg()
    }, DRAW_INTERVAL_DURATION)
    // drawBackgroundInterval = setInterval(() => draw(), DRAW_INTERVAL_DURATION)
  }
})

document.addEventListener('mouseup', () => {
  isDrawing = false
  clearInterval(drawInterval)
})

document.addEventListener('mousemove', e => {
  [currentX, currentY] = [e.clientX, e.clientY]
  if (currentX > SIDEBAR_WIDTH) {
    cursor.style.display = "block"
    cursor.style.left = (currentX - (iconSize / 2)) + "px"
    cursor.style.top = (currentY - (iconSize / 2)) + "px"

  } else {
    cursor.style.display = "none"
  }
})

function drawSvg() {
  let icon = document.createElement('ion-icon')
  icon.setAttribute('name', selectedIcon)
  icon.style.position = "absolute"
  icon.style.left = (currentX - (iconSize / 2)) + "px"
  icon.style.top = (currentY - (iconSize / 2)) + "px"
  icon.style.fontSize = iconSize + "px"
  icon.style.color = Please.HSV_to_HEX(getRandomColor())
  body.appendChild(icon);
  shouldDrawSplatter = true
}


function createCursor() {
  if (cursor) {
    cursor.remove()
  }
  cursor = document.createElement("ion-icon")
  cursor.setAttribute('name', selectedIcon)
  cursor.style.color = iconSize < 100 ? "#c9c9c9" : "#f2f2f2"
  cursor.style.position = "absolute"
  cursor.style.fontSize = iconSize + "px"
  body.appendChild(cursor)
}

function selectIcon(newIconName) {
  document.getElementById(selectedIcon).style.backgroundColor = "rgb(239, 239, 239)";
  selectNewIcon(newIconName)
  createCursor()
  cursor.style.display = "none"
}

function selectNewIcon(newIconName) {
  selectedIcon = newIconName;
  document.getElementById(selectedIcon).style.backgroundColor = "#2ca0f2";
}

function changeColors() {

  baseColor = Please.make_color({
    format: "hsv",
    hue: Math.random() * 360,
    saturation: Math.max(Math.random(), 0.5),
    value: Math.min(Math.max(Math.random(), 0.7), 0.8),
    golden: false
  })[0]

  // let schemeTypes = [
  //   'monochromatic',
  //   'complementary',
  //   'split-complementary',
  //   'double-complementary',
  //   'analogous',
  //   'triadic',
  // ]
  colors = Please.make_scheme(baseColor, {
    // scheme_type: schemeTypes[Math.floor(Math.random() * schemeTypes.length)],
    format: "hsv"

  })


  let colorsEl = document.getElementById("colors")
  colorsEl.innerHTML = ''
  for (let color of colors) {
    let colorEl = document.createElement('div')
    colorEl.style.backgroundColor = Please.HSV_to_HEX(color)
    colorsEl.appendChild(colorEl)
  }

}

function changeSize(newSize) {
  // sizeEl.style.width = newSize + "px";
  // sizeEl.style.height = newSize + "px";
  iconSize = newSize
  createCursor()
  cursor.style.display = "none"
  // strokeWidth = - (((newSize - 30) * (16/370)) - 16) + 16
}


function renderIcons() {
  icons.forEach(({name, color}) => {
    let button = document.createElement("button")
    button.id = name
    button.className = "button-container"
    button.onclick = () => selectIcon(name)

    let iconEl = document.createElement("ion-icon")
    iconEl.setAttribute('name', name)
    iconEl.style.color = "rgba(0,0,0,0.6)";

    button.appendChild(iconEl)
    sidebar.appendChild(button)
  })
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}




function paintSplatter() {
  const WIDTH = canvas.offsetWidth
  const HEIGHT = canvas.offsetHeight

  function getNearbyPoint(x, y) {
    do {
      let v = p5.Vector.random2D()
    } while (true)
  }

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT)

    p.colorMode(p.HSL)

    p.background(255)
  }

  function draw(p) {
    let randomColor = {...getRandomColor()};
    randomColor.s = 0.15
    randomColor.v = 0.95
    let color = p.color(Please.HSV_to_HEX(randomColor))
    // color.setAlpha(0.25)
    p.fill(color)
    p.noStroke()
    // p.stroke(color)
    p.strokeWeight(10)
    if (isDrawing && shouldDrawSplatter) {
      // p.bezier(
      //   p.mouseX,
      //   p.mouseY,
      //   Math.random() * WIDTH,
      //   Math.random() * HEIGHT,
      //   Math.random() * WIDTH,
      //   Math.random() * HEIGHT,
      //   p.pmouseX,
      //   p.pmouseY
      // )

      // let xoff =
      const COUNT = 20

      let xoff = Math.random() * 20

      p.beginShape()

      for (let theta = 0; theta < 2*Math.PI; theta += 2*Math.PI / COUNT) {
        let x = (Math.cos(theta) * p.noise(xoff)*iconSize) + (currentX - SIDEBAR_WIDTH + (iconSize / 8))
        let y = (Math.sin(theta) * p.noise(xoff) * iconSize) + currentY
        p.vertex(x, y)
        xoff += 1
      }

      p.endShape(p.CLOSE)


      // p.noise()

      // p.mouseX

      shouldDrawSplatter = false

      // I want to do something every x times, I could make a

    }
    // if (p.frameCount % 10000 === 0) {
    //   let color = p.color(100, 100, 30)
    //   color.setAlpha(100)
    //   p.fill(color)
    //   let radius = getRandomInRange(25) + 25
    //   p.ellipse(getRandomInRange(p.width), getRandomInRange(p.height), radius, radius)
    // }
  }

  let myP5 = new p5(function (p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, canvas);
}

/*
- dice: dice-outline
- lightning: flash-outline
- happy face: happy-outline
- music: musical-notes-outline OR musical-note-outline
- skull: skull-outline
- airplane: airplane-outline
- fish: fish-outline
- man: man-outline
- woman: woman-outline
- soccer: football-outline
 */