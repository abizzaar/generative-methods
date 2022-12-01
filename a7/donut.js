class Donut {
  constructor(aof) {
    this.center = new Vector()
    this.aof = aof;
    this.donutRotation = 0
    // this.donutRotation = Math.random() * 2 * Math.PI
    this.isRotatingClockwise = true
  }

  update(t, dt) {
   //this.updateRotation()
  }

  updateRotation() {
    if (this.isRotatingClockwise) {
      this.donutRotation += 2 * dt
    } else {
      this.donutRotation -= 2 * dt
    }

    if (2*Math.PI < this.donutRotation) {
      this.isRotatingClockwise = false
    }

    if (this.donutRotation < 0) {
      this.isRotatingClockwise = true
    }
  }

  draw(p) {

    let donutColor = p.color(34, 59, 85)
    let handLength = 40 * this.aof.get("limbLength")
    let handAngle = (20 / 360) * (2 * Math.PI)
    let legLength = 100 * this.aof.get("limbLength")
    let legAngle = (75 / 360) * (2 * Math.PI)
    let donutWidth = 30 + (this.aof.get("donutWidth") * 30)
    let donutHeight = 30 + (this.aof.get("donutHeight") * 30)
    let toppingHue = this.aof.get("colorHue")*360
    let toppingSaturation = 20 + this.aof.get("colorSaturation") * 80
    let toppingLightness = 20 + this.aof.get("colorLightness") * 60
    let toppingColor = p.color(toppingHue, toppingSaturation, toppingLightness)
    let eyeBallColor = p.color(this.aof.get("color")*360, 50, 40)
    
    p.push()
    p.noStroke()
    p.strokeWeight(5)
    p.translate(0, - donutHeight - legLength)

    // initial values for hole
    let holeRadius = this.aof.get("holeSize") * (donutWidth - 20)
    let holeWidth, holeHeight;
    if (donutHeight > donutWidth) {
      holeWidth = holeRadius * (donutWidth / donutHeight)
      holeHeight = holeRadius
    } else {
      holeWidth = holeRadius
      holeHeight = holeRadius * (donutHeight / donutWidth)
    }

    // draw hands
    p.stroke(donutColor)
    if (this.aof.get("limbLength") !== 0) {

      // drawHand(p, handLength, -handAngle, donutWidth, donutHeight)
      // drawHand(p, handLength, Math.PI + handAngle, donutWidth, donutHeight)

      drawLeg(p, legLength, legAngle, donutWidth, donutHeight)
      drawLeg(p, legLength, Math.PI - legAngle, donutWidth, donutHeight)
    }

    // draw ears
    p.fill(donutColor)
    drawEar(p, 8, -handAngle, donutWidth, donutHeight)
    drawEar(p, 8, Math.PI + handAngle, donutWidth, donutHeight)

    p.noStroke()

    // add topping
    p.push()

    // rotate a bit
    p.rotate(this.donutRotation)

    // outer circle of donate
    p.fill(donutColor)
    p.ellipse(0, 0, donutWidth, donutHeight)

    // hole inside donut
    p.fill(190, 80, 90)
    p.ellipse(0, 0, holeWidth, holeHeight)

    // add topping
    p.fill(toppingColor)
    p.beginShape()
    addIrregularCircleToShape(p, 30, 20 * this.aof.get("toppingCraziness"), donutWidth * 0.95, donutHeight * 0.95, this.aof.get("toppingPatternSeed")*2300)
    p.beginContour()
    addIrregularCircleToShape(p, 30, 4 * this.aof.get("toppingCraziness"), holeWidth * 1.2, holeHeight * 1.2, this.aof.get("toppingPatternSeed")*2500, true)
    p.endContour()
    p.endShape()
    p.pop()

    // eyes
    p.push()
    p.fill("white")
    p.ellipse(...new Vector().setToElliptical(donutWidth-20, donutHeight-10, - handAngle).coords, 6, 8)
    p.ellipse(...new Vector().setToElliptical(donutWidth-20, donutHeight-10, Math.PI + handAngle).coords, 6, 8)

    p.fill(eyeBallColor)

    p.ellipse(...new Vector().setToElliptical(donutWidth-20, donutHeight-10, - handAngle).coords, 3, 4)
    p.ellipse(...new Vector().setToElliptical(donutWidth-20, donutHeight-10, Math.PI + handAngle).coords, 3, 4)
    p.pop()

    p.pop()
  }
}

function drawHand(p, length, angle, width, height) {
  let start = new Vector().setToElliptical(width, height, angle)
  let end = new Vector().setToElliptical(width + length, height + length, angle)
  p.line(...start.coords, ...end.coords)
}

function drawEar(p, circleSize, angle, width, height) {
  let pt = new Vector().setToElliptical(width, height, angle)
  p.circle(...pt.coords, circleSize)
}

function drawLeg(p, length, angle, width, height) {
  let start = new Vector().setToElliptical(width, height, angle)
  let end = Vector.add(start, [0, length])
  p.line(...start.coords, ...end.coords)
}

function addIrregularCircleToShape(p, numAnchors, maxDistOfCurveFromCircle, width, height, seed, isContour = false) {

  // random function that accepts seed (https://stackoverflow.com/a/19303725)
  function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // make outer border of topping
  let startPt = new Vector().setToElliptical(width, height, 0)

  p.curveVertex(...startPt.coords)
  p.curveVertex(...startPt.coords)

  let step = (2 * Math.PI) / numAnchors

  let theta, endCondition, nextIteration;
  if (!isContour) {
    theta = 0
    endCondition = () => theta < (2 * Math.PI)
    nextIteration = () => theta += step
  } else {
    theta = (2 * Math.PI) - step
    endCondition = () => theta > 0
    nextIteration = () => theta -= step
  }

  for (; endCondition(); nextIteration()) {
    const getPointNearCircle = (angle) => {
      let pt;
      if (height > width) {
        pt = Vector.add(
          [distFromCircle * (width / height), distFromCircle],
          new Vector().setToElliptical(width, height, angle)
        )
      } else {
        pt = Vector.add(
          [distFromCircle, distFromCircle * (height / width)],
          new Vector().setToElliptical(width, height, angle)
        )
      }
      return pt;
    }

    let distFromCircle = ((random() * 2) - 1) * maxDistOfCurveFromCircle
    let currPt = getPointNearCircle(theta)

    p.curveVertex(...currPt.coords)
  }

  p.curveVertex(...startPt.coords)
  p.curveVertex(...startPt.coords)
}

Donut.labels = ["colorHue", "colorSaturation","colorLightness","toppingCraziness", "limbLength", "donutHeight", "donutWidth", "holeSize", "toppingPatternSeed"]
Donut.landmarks = {
  "perfect": [0.30,0.13,0.49,0.00,0.41,1.00,1.00,0.34, 1],
  "happy": [0.65,0.52,0.66,1.00,0.69,1.00,1.00,0.53, 1],
  "skinny": [1.00,0.49,0.69,0.19,1.00,1.00,0.00,0.69, 1],
  "wobbly": [0.93,1.00,0.90,0.38,0.42,0.00,1.00,0.32, 1],
  "goofy": [0.57,0.63,0.70,1.00,0.37,0.68,0.23,0.20, 1]
}