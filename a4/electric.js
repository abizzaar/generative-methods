class ElectricParticles {
  constructor() {
    this.isMovingTowardsTarget = true
    this.target = getRandomPoint()
    this.particles = []
    this.timeElapsedMovingAwayFromTarget = 0
  }

  draw(p) {
    this.particles.forEach(pt => pt.draw(p, this.isMovingTowardsTarget, this.target))

    if (this.isMovingTowardsTarget) {
      let isAllParticlesReached = true
      this.particles.forEach(pt => {
        if (Vector.getDistance(pt.position, this.target) > 10) {
          isAllParticlesReached = false
        }
      })
      if (isAllParticlesReached) {
        this.target = getRandomPoint()
        this.particles.forEach(pt => pt.updateVelocityUnitVector(this.target))
        this.isMovingTowardsTarget = false
        this.timeElapsedMovingAwayFromTarget = 0
      }
    }
    else {
      if (this.timeElapsedMovingAwayFromTarget > SLIDERS.purpleWanderTime.value()) {
        this.isMovingTowardsTarget = true
        this.particles.forEach(pt => pt.updateVelocityUnitVector(this.target))
      } else {
        this.timeElapsedMovingAwayFromTarget++
      }

    }
  }

  addParticle() {
    this.particles.push(
      new ElectricParticle(this.target)
    )
  }

  debugDraw(p) {
    if (this.isMovingTowardsTarget) {
      p.fill(0)
      p.noStroke()
    }
    else {
      p.noFill()
      p.stroke(0)
      p.strokeWeight(2)
    }

    p.circle(...this.target, 20)
  }
}

class ElectricParticle {
  constructor(target) {
    this.position = getRandomPoint()
    this.velocityUnitVector = Vector.empty(2)
    this.updateVelocityUnitVector(target)
    this.velocity = this.velocityUnitVector.map(x => x*0.02)
    this.velocityBoostScale = 1 + Math.random()
  }

  draw(p, isMovingTowardsTarget, target) {
    if (isMovingTowardsTarget) {
      let delta = Vector.empty(2).setToDifference(
        target,
        this.position
      )

      let unitDelta = new Vector(
        delta[0] / delta.magnitude,
        delta[1] / delta.magnitude
      )

      // unitDelta.drawArrow({p, center: this.position, multiple: 20})

      let force = new Vector(0, 0)
      // force.addMultiples(this.velocityUnitVector, 0.02)
      force.addMultiples(unitDelta, p.lerp(0, delta.magnitude, 0.02*this.velocityBoostScale))

      // let unitForce = new Vector(
      //   force[0] / Math.max(force.magnitude, 0.1),
      //   force[1] / Math.max(force.magnitude, 0.1)
      // )

      // let maxSpeed = p.lerp(0, delta.magnitude, 100)
      // if (force.magnitude > maxSpeed) {
      //   force.mult(maxSpeed/force.magnitude)
      // }
      this.position.add(force)
    } else {
      this.position.addMultiples(this.velocityUnitVector, 2*this.velocityBoostScale)
    }

    // wraparound
    // this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
    // this.position[1] = (this.position[1] + simulationWidth)%simulationWidth

    p.noStroke()
    p.fill(258, 69, 61)
    p.circle(...this.position, 10)
  }

  updateVelocityUnitVector(target) {
    this.velocityUnitVector = Vector.empty(2).setToDifference(
      target,
      Vector.add(target, Vector.polar(1, Math.random() * 2*Math.PI))
    )
  }
}

function getRandomUnitVector() {
  let vec = new Vector(Math.random()-0.5, Math.random()-0.5)
  vec.mult(1/vec.magnitude)
  return vec
}

function getRandomPoint() {
  return new Vector(
    Math.random() * simulationWidth,
    Math.random() * simulationHeight
  )
}