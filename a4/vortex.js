
class VortexParticles {
	constructor() {
		this.particles = []
		this.vortex = new Vector(simulationWidth/2, simulationHeight/2)
		this.vortexTarget = new Vector(0, 0)
		this.isVortexTargetBreath = true
		this.getWindForce = this.getWindForce.bind(this)
	}

	add(particle) {
		this.particles.push(particle)
	}

	update(t, dt) {
	  this.vortex.addMultiples(
	  	Vector.empty(2).setToDifference(
	  		this.vortexTarget,
				this.vortex
			),
			0.01
		)

		if (Vector.getDistance(this.vortex, this.vortexTarget) < 50) {
			if (this.isVortexTargetBreath) {
				let width = Math.random() > 0.5 ? simulationWidth : 0
				let height = Math.random() * simulationHeight
				this.vortexTarget = new Vector(width, height)
			} else {
				let width = Math.random() * simulationWidth
				let height = Math.random() > 0.5 ? simulationHeight : 0
				this.vortexTarget = new Vector(width, height)
			}
			this.isVortexTargetBreath = !this.isVortexTargetBreath
		}

		this.particles.forEach(pt => pt.update(t, dt, this.getWindForce))
	}

	draw(p) {
		this.particles.forEach(pt => pt.draw(p))
	}

	// Get the wind force at this time and position
	getWindForce(t, x, y) {
		let scale = .002
		let posToVortexVector = Vector.empty(2).setToDifference(
			this.vortex,
			[x, y],
		)
    let theta = posToVortexVector.angle
    let strength = SLIDERS.blueVortexStrength.value()
		let r = 100 + 1900*strength*strength

		return Vector.polar(r, 1+theta) // 90 degrees in radians + THETA
	}

	// Draw a windmap of the vortex at the current time
	debugDrawVortex(p, t) {

		// How many columns and rows of points do we want?
		let tileSize = 20
		let tileX = Math.floor(simulationWidth/tileSize)
		let tileY = Math.floor(simulationHeight/tileSize)

		let drawScale = .04
		for (var i = 0; i < tileX; i++) {
			for (var j = 0; j < tileY; j++) {

				// What point are we at?
				let x = tileSize*(i + .5)
				let y = tileSize*(j + .5)

				// Calculate the force here
				let force = this.getWindForce(t, x, y)

				// Draw the current wind vector
				p.fill(240, 70, 50)
				p.noStroke()
				p.circle(x, y, 2)
				p.stroke(240, 70, 50, .8)
				p.line(x, y, x + drawScale*force[0], y + drawScale*force[1])
			}
		}
	}
}

// Particles that are pushed around by a wind vectorfield
class VortexParticle {
	constructor(position, velocity) {
		if (velocity === undefined)
			velocity = Vector.randomPolar(10)
		
		if (position === undefined)
			position = new Vector(Math.random()*simulationWidth, Math.random()*simulationHeight)
		
		// Create a random particle... somewhere
		this.position = new Vector(...position)
		this.velocity = new Vector(...velocity)

		// Randomly sized particle
		this.size = 10 + Math.random()*10

		this.windForce = new Vector(0, 0)

		this.maxSpeed = 100 + (Math.random() * 200)
	}

	draw(p) {
		p.textSize(this.size)
		p.noStroke()
		p.fill(182, 46, 79)
		p.circle(...this.position, 10)
	}


	// Time and delta time
	update(t, dt, getWindForce) {
		this.windForce = getWindForce(t, ...this.position)

		// Move with the wind force, but bigger particles move less
		this.velocity.addMultiples(this.windForce, dt*500/this.size) // 500

		let speed = this.velocity.magnitude
		if (speed > this.maxSpeed)
			this.velocity.mult(this.maxSpeed/speed)

		this.position.addMultiples(this.velocity, dt)

		this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
		this.position[1] = (this.position[1] + simulationHeight)%simulationHeight
	}
}