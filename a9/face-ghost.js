class GhostMask {
  constructor() {
  }

  draw(p, t) {

    p.background(0, 0, 0, 0.02+(1-SLIDER.trail)*0.98)

    face.points.forEach((pt, i) => {
      p.noStroke()
      let dist = Vector.getDistance(pt, face.center)
      p.fill((pt.index % 100) + SLIDER.faceColor * 260, 50, 50, ((dist / 100) + t / 100) % (0.1 + SLIDER.faceFuzziness * 0.9))
      pt.draw(p, SLIDER.faceCirclesSize*30)
    })

    face.sideOrder.forEach(side => {
      p.stroke(0)
      p.fill(80 + side.index * 15)

      p.noFill()
      p.push()
      p.strokeWeight(20)
      p.stroke("black")
      side.eye.draw(p, 5)
      p.pop()

    })

    p.push()
    p.stroke(360, 100, 15)
    p.strokeWeight(3)
    p.fill(360, 100, 22, 0.4)
    face.mouth.forEach((mouthLine, mouthIndex) => {
      if (mouthIndex === 3 || mouthIndex === 4) {
        drawContour(p, mouthLine, true)
      }

    })
    p.pop()


    hand.forEach(h => {

      p.push()
      p.noFill()
      p.angleMode(p.RADIANS)

      h.fingers.forEach((finger, fingerIndex) => {

        p.stroke(0, 0, 100, 0.1)
        finger.forEach((_, i) => {
          if (i !== 0) {
            p.line(...finger[i - 1].coords, ...finger[i].coords)
          }
        })
        p.stroke(0, 0, 100, 0.4)
        p.strokeWeight(2)
        drawFingerPoint(p, finger[finger.length - 1], SLIDER.fingerTipMotion * 20, 10)

      })
      p.pop()
    })
  }

  update(t, dt, frameCount) {

  }
}

function drawFingerPoint(p, center, maxDistOfCurveFromCircle, radius) {

  let numPoints = 10

  let startPt = Vector.add(
    center,
    new Vector().setToPolar(radius, 0)
  )

  p.beginShape()

  p.curveVertex(...startPt.coords)
  p.curveVertex(...startPt.coords)

  let step = (2 * Math.PI) / numPoints
  let theta;

  for (theta = step; theta < (2 * Math.PI); theta += step) {
    let distFromCircle = ((Math.random() * 2) - 1) * maxDistOfCurveFromCircle

    let currPt = Vector.add(
      new Vector().setToPolar(radius + distFromCircle, theta),
      center
    )

    p.curveVertex(...currPt.coords)
  }

  p.curveVertex(...startPt.coords)
  p.curveVertex(...startPt.coords)

  p.endShape()
}

masks.ghost = GhostMask