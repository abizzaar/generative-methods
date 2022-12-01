let paused = false
document.addEventListener('keyup', function (e) {
  if (e.keyCode == 32) {
    paused = !paused
  }
  if (e.keyCode == 78) {
    sim.step()
  }
});

let noise = new p5().noise
console.log(noise)
let sim = new Simulation()
var MAX_COUNT = 10;

document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    template: `<div id="app">

	    <p>How can the internet can help us find mentors
	    that some of us wouldn't have otherwise found in our neighborhoods?
	    This essay shows some preliminary explorations of this question.<br><br>
	    In the simulations below, each grid is a person, 
	    and the people around them form their neighborhood.
			The darkness of the grid represents their skill level.
			A valid mentor-mentee match ensures that the mentor has greater 
			skill than the mentee.
			The simulations also respect that each person can only be 
			mentored by one person, and can only mentor one person themselves.
	    </p>

			<simulation mode="in-person"/>

			<p>
			This first exploration simulates an in-person model of mentorship in
			which people only look for mentors in their neighborhood.
			Since we were initializing the grid randomly, I expected to get different
			outcomes each time - but I found it interesting to see that you 
			always get an avg skill gained ratio of around 0.62.
			</p>
			
			<simulation mode="virtual"/>
			
			<p>
			 The second exploration is a virtual model of mentorship which 
			 is the same as before but it removes the neighborhood constraint.
			 It uses a greedy algorithm to create the optimal mentor-mentee matches
			 such that we maximize the number of people mentored in each step.
			 As you can see, especially after just the first couple of steps, we are
			 able to increase skill by a lot more (0.9+) in each step.
			 However, because of the nature of the simulation, as people 
			 become more skilled the space gets saturated and so we see the skill
			 gained ratio decreasing. Future work could explore how to reduce this
			 saturation.
      </p>
			

			<simulation mode="virtual-effectiveness"/>
			
       <p>The virtual format of mentorship might not be as effective as 
        in-person mentorship, so this third exploration provides a slider
        that lets you set the effectiveness of virtual mentorship relative
        to in-person.
        Here, it's interesting to see that above 70% effectiveness slider value,
        virtual remains better than in-person, but then it starts doing worse.<br><br>
        I found it particularly interesting to note that, when this simulation
        performs as well as in-person (at around 70%), we distribute skill
        a lot less evenly than in the neighborhood approach, with some people
        becoming very skilled and others remaining unskilled. This is probably due
        to the way I sort people in the greedy algorithm I use, but it's an interesting
        way to visualize how an algorithm can create effects you didn't anticipate,
        and would be a good discussion topic for CS ethics. <br><br>
    
        Overall we'd be able to make a better argument for virtual 
        mentorship as we make the model more representative 
        and incorporate the following:
        (1) make some regions of the world have less skilled people than others,
        just like how the actual world is,
        which would make the neighborhood matching perform worse
        (2) skill could be broken down into all the different skills (computer
        science, writing, biology, etc.), adding more constraints to the optimization
        and better motivating the need for virtual matching.
       </p>

		</div>`,

  })
})