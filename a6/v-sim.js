Vue.component("simulation", {
  template: `
	<div class="simulation">
		Mentorship ({{mode}} mode)
		
		<!-- Draw the grid, and optionally specify the size -->
		<grid-p5 :sim="sim" :size="mode=='emoji'?24:12" />

		<div class="controls">
			
			<div v-if="mode=='virtual-effectiveness'">
				Virtual effectiveness	<input v-model="sim.virtualEffectiveness" type="range" 
				min="0.0" max="1.0" value="0.7" step="0.1" 
				class="slider">
			</div>
			
			<div>Avg ratio of skill gained over total skill possible: {{sim.stepCount === 0 ? 0 : (sim.totalSkillGained / (sim.stepCount * sim.w * sim.h)).toFixed(2)}}</div>

			<button class="emoji-button" @click="sim.randomize()">🎲</button>
			<button class="emoji-button" @click="sim.step()">🥾</button>
			<button class="emoji-button" @click="sim.isPaused=!sim.isPaused">{{sim.isPaused?"▶️":"⏸"}}</button>
		</div>
	</div>
	`,
  mounted() {

    // Handle updating this simulation
    setInterval(() => {
      if (this.sim.stepCount < MAX_COUNT && !this.sim.isPaused) {
        this.sim.step()
      }
    }, 400)
  },

  props: ["mode"],

  data() {
    return {
      sim: new Simulation(this.mode)
    }
  }


})