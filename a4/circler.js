class Circler {
  constructor() {
    this.particles = []
    this.velocity = 0
    this.radiusScale = 0.8
  }

  debugDraw(p) {
    // console.log("HERE")
    p.translate(p.width / 2, p.height / 2)
    p.noFill()
    p.stroke(50)
    p.strokeWeight(2)
    p.circle(0, 0, this.radiusScale*p.width)
  }

  draw(p, t, dt) {
    this.radiusScale = noise(t*0.9)

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(p, dt, this.radiusScale*simulationWidth/2)
    }

    for (let i = 0; i < this.particles.length; i++) {
      // this.particles[i].update(t, dt)
    }
  }

  update(t, dt) {

  }

  addParticle() {
    this.particles.push(new CirclerParticle(this.radiusScale*simulationWidth/2))
  }
}

class CirclerParticle {
  /*
    What does this particle need to do at each step?

    Move with one velocity around a circle

    Now that I have the circle changing radius,  I should have circles moving
    around that radius.

    I will want to have a perpendicular force equal to .
    For the actual velocity, I think I set it to
    Vector.
  */

  constructor(radius) {
    this.position = Vector.polar(radius, Math.random() * (2*Math.PI))
    this.position[0] += (simulationHeight / 2)
    this.position[1] += (simulationHeight / 2)
    this.direction = Math.random() > 0.5 ? 1 : -1
    this.velocityScale = 50 + (Math.random() * 200)
    this.attractionToCircleScale = 0.2 + (Math.random() * 1)
    // this.theta =
    // this.radius = randomPoint(p)
  }

  draw(p, dt, radius) {
    let positionOffsetToOrigin = Vector.add(
      this.position,
      [-p.width/2, -p.height/2]
    )
    let posAngle = positionOffsetToOrigin.angle
    let dist = Vector.random().setToDifference(
      Vector.polar(radius, posAngle),
      positionOffsetToOrigin,
    )
    // dist.drawArrow({p, center: this.position, multiple: 0.5})

    p.noStroke()
    p.fill(354, 82, 51)
    this.velocity =
      Vector.getNormal(
        ([(p.width/2)-this.position[0], (p.height/2)-this.position[1]])
      ).mult(this.direction)
    this.velocity.addMultiples(dist, dt*this.attractionToCircleScale*SLIDERS.redSnapForce.value())
    this.position.addMultiples(this.velocity, dt*this.velocityScale)
    p.circle(...this.position, 10)
    // this.velocity.drawArrow({p, center: this.position, arrowSize: 20})
    // console.log(this.velocity.magnitude)
  }

  update(t, dt) {
    dt = Math.min(1, dt)

  }
}

// So how do we store the current circle