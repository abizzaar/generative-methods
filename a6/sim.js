// let emoji = "🌷 🐑 🌲 🌳 🌴 🐟 🐠 🐡 🌱 🦞 🐙 🦀 🦐 🐄".split(" ")
let emoji = "🌷 🐑 🌲".split(" ")

class Simulation {
  // Some number of grids
  constructor(mode) {
    // Mode can control various factors about the simulation

    this.mode = mode
    this.stepCount = 0
    this.totalSkillGained = 0
    this.maxSkill = MAX_COUNT * 2

    // Set my size
    this.w = 54
    this.h = 10

    this.isWrapped = true
    this.isPaused = true
    this.selectedCell = undefined

    this.virtualEffectiveness = 1

    this.mentorshipGrid = new Grid(this.w, this.h, this.isWrapped)

    this.randomize()

  }

  randomize() {
    console.log("set to a random layout")
    this.stepCount = 0
    this.totalSkillGained = 0

    // Initialize all grids between 0 and MAX_COUNT * 100
    this.mentorshipGrid.setAll((_x, _y) => Math.floor(Math.random() * this.maxSkill))
  }

  hash(x, y) {
    return x + " " + y
  }

  computeInPersonMentorship() {
    // for in-person mentors, we can maintain a set of all mentors hashed by "x y"
    //  then, we just loop through the grid, and we look at each neighbor and if any neighbor has more skill and doesn't
    //  already mentored we add 1 to the skill, otherwise we just
    let assignedMentors = new Set()
    this.mentorshipGrid.setNext((x, y, currentSkill) => {
      let neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
      let updatedSkill = currentSkill
      for (let [neigh_x, neigh_y] of neighbors) {
        let neighborSkill = this.mentorshipGrid.get(neigh_x, neigh_y)
        if (!assignedMentors.has(this.hash(neigh_x, neigh_y)) && neighborSkill > currentSkill) {
          assignedMentors.add(this.hash(neigh_x, neigh_y))
          updatedSkill += 1
          this.totalSkillGained += 1
          break
        }
      }

      return updatedSkill
    });
  }

  computeVirtualMentorship(effectiveness = 1) {
    console.log(effectiveness)
    // for virtual, we will have to create a set of which people get mentored, which can be represented as an array of arrays
    // we can first traverse the entire grid and then create a new structure of [x, y, knowledge]
    // we sort that structure in order of increasing knowledge
    // we can duplicate that structure to store mentors and mentees separately
    // we can then traverse through the mentees and try to assign a mentor - if not possible, pop mentee. if possible, pop both mentor and mentee
    // we also keep constructing a list of mentees that have been mentored - then we can just set all next to be equal to grid,
    // and loop through the mentees assigned and append their skill by 1

    let people = []
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        people.push({
          x: j,
          y: i,
          skill: this.mentorshipGrid.get(j, i)
        })
      }
    }

    people.sort((a, b) => a.skill - b.skill)

    let mentors = people.slice(0)

    let mentees = []

    while (people.length !== 0) {
      let currPerson = people.pop()
      if (mentors[mentors.length - 1].skill > currPerson.skill) {
        mentees.push(currPerson)
        mentors.pop()
      }
    }

    this.mentorshipGrid.setNext((_x, _y, currentSkill) => currentSkill)
    for (let mentee of mentees) {
      console.log("skill")
      console.log(mentee.skill)
      console.log(mentee.skill + effectiveness)
      this.mentorshipGrid.next[mentee.y][mentee.x] = mentee.skill + effectiveness
    }
    this.totalSkillGained += mentees.length * effectiveness
  }

  step() {
    if (this.stepCount >= MAX_COUNT) {
      alert("Only 10 steps allowed in simulation");
      return;
    }
    this.stepCount++

    // Make one step
    // Set all the next steps, then swap the buffers


    switch (this.mode) {
      case "in-person": {
        this.computeInPersonMentorship();
        break;
      }
      case "virtual": {
        this.computeVirtualMentorship()
        break;
      }

      case "virtual-effectiveness": {
        this.computeVirtualMentorship(parseFloat(this.virtualEffectiveness))
        break;
      }

      default: {
        this.computeInPersonMentorship();
        break;
      }
    }

    //Show the whole grid for debugging
    // this.mentorshipGrid.debugPrintGrid()

    // Swap the new value buffer into the current value buffer
    this.mentorshipGrid.swap()
  }


  //==============
  // Draw a cell.  Add emoji or color it


  drawCell(p, x, y, cellX, cellY, cellW, cellH) {
    p.strokeWeight(1)
    p.stroke(0, 0, 0, .2)

    let normalizedVal = this.mentorshipGrid.get(x, y) / this.maxSkill

    p.fill(214, 90, 90 - (normalizedVal * 80))
    p.rect(cellX, cellY, cellW, cellH)
  }

  //=====================================================
  // Mouse interactions

  select(x, y) {
    this.selectedCell = [x, y]
  }

  click(x, y) {
    this.gameOfLifeGrid.set(x, y, 1)
  }


  //=====================================================
  // Utility functions


  getNeighborPositions(x1, y1, wrap) {
    let x0 = x1 - 1
    let x2 = x1 + 1
    let y0 = y1 - 1
    let y2 = y1 + 1
    if (wrap) {
      x0 = (x0 + this.w) % this.w
      x2 = (x2 + this.w) % this.w
      y0 = (y0 + this.h) % this.h
      y2 = (y2 + this.h) % this.h
    }

    return [[x0, y0], [x1, y0], [x2, y0], [x2, y1], [x2, y2], [x1, y2], [x0, y2], [x0, y1]]
  }


}