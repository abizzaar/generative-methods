// Outermost scope,
// You can access these variables from *anywhere*, in fxns, or in html

// These get created when P5 is initialized
let SLIDERS = {

}

let FLAGS = {
	drawVortexDebug: false,
	drawCirclerDebug: false,
	drawElectricDebug: false
}

// Store our two Processing instances in the global scope
// so we can refer to them separately when we want
let mainP5 = undefined

let simulationWidth = 600
let simulationHeight = 360

// Circler things
const circlerStartCount = 0
let circler = new Circler()

// Electric things
const electricStartCount = 0
let electricParticles = new ElectricParticles()

// Hold some snow ❄️
const vortexParticleStartCount = 0
let vortexParticles = new VortexParticles()

// Moving noise into the global scope so its not attached to P5
let noise = function() {
	console.warn("Noise not yet initialized")
}

// Create a p5 slider, but ALSO, label it and append it to the controls object
function createSlider({label, min,max, defaultValue, step=1}) {
	SLIDERS[label] = mainP5.createSlider(min, max, defaultValue, step)

	let controls = document.getElementById("controls")
	let holder = document.createElement("div");
	holder.className = "slider"
	holder.innerHTML = "<div class='slider-label'>" + label + "</div>"

	// Add things to the DOM
	controls.append(holder)
	holder.append(SLIDERS[label].elt)
}

// random point returns a point somewhere in this processing object
function randomPoint(p) {
	return [(Math.random())*p.width, (Math.random())*p.height]
}

function createVortexParticles(num) {
	for (var i = 0; i < num; i++) {
		let pt = new VortexParticle()
		vortexParticles.add(pt)
	}
}

function createElectricParticles(num) {
	for (let i = 0; i < num; i++) {
		electricParticles.addParticle()
	}
}

function createCirclerParticles(num) {
	for (let i = 0; i < num; i++) {
		circler.addParticle()
	}
}

// Do setup
document.addEventListener("DOMContentLoaded", function(){
	console.log("Steering")

	// Create the processing instances, and store it in mainP5
	// where we can access it anywhere in the code

	mainP5 = new p5(

		// Run after processing is initialized
		function(p) {

			// Set the noise function to P5's noise
			noise = p.noise

			p.setup = () => {

				// Basic setup tasks
				p.createCanvas(simulationWidth, simulationHeight);
				p.colorMode(p.HSL);
				p.background("white")

				createVortexParticles(vortexParticleStartCount)
				createElectricParticles(electricStartCount)
				createCirclerParticles(circlerStartCount)

				// CREATE SLIDERS!!
				createSlider({label:"blueVortexStrength", min:.01, max: 2, defaultValue: .4, step: .1})
				createSlider({label:"redSnapForce", min:0.1, max: 5, defaultValue: 1, step: .1})
				createSlider({label:"purpleWanderTime", min:10, max: 100, defaultValue: 70})
			}

			p.draw = () => {
				p.background(360, 100, 100, 1)

				// Not updating the background
				let t = p.millis()*.001
				let dt = p.deltaTime*.001

				// UPDATE!
				vortexParticles.update(t, dt)

				// Draw vortex things
				vortexParticles.draw(p)
				if (FLAGS.drawVortexDebug) {
					vortexParticles.debugDrawVortex(p, t)
				}

				// Draw circlers
				circler.draw(p, t, dt)
				if (FLAGS.drawCirclerDebug) {
					circler.debugDraw(p)
				}

				// Draw electrics
				electricParticles.draw(p)
				if (FLAGS.drawElectricDebug) {
					electricParticles.debugDraw(p)
				}
			}
		}, 

	// A place to put the canvas
	document.getElementById("main"));
})
