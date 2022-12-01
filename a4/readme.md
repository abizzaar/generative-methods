# Abizar - Particle Effects (A4)

I created 3 particle types:
- Blue Vortex: Building on Prof Compton's snow example, particles follow a moving vortex (instead of using perlin noise).
  The idea was got from this tweet by Brian Skinner: https://twitter.com/gravity_levity/status/1361115188964036609?s=20
- Red Circler: Particles follows a snappy circle that changes its radius based on the perlin noise function.
- Purple Electricity: Particles either move away from a randomly generated focus point or gravitate (lerp) towards it.

Note that clicking "+50 red" directly generates 50 red particles. Mouse-clicks on the Canvas do nothing. 

The debug drawing should be self-explanatory.

Controls:
- blueVortexStrength: Controls the strength of the vortex
- redSnapForce: Controls how forcefully particles snap to the circle
- purpleWanderTime: Controls how long particles wander before being sucked in by the focus point