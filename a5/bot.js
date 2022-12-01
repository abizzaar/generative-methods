class InternBot {
 constructor() {
		this.grammar = tracery.createGrammar(internGrammar)
		this.grammar.addModifiers(baseEngModifiers)
	}

	respondTo(s) {
 		s = s.toLowerCase()
		if (s.includes("startup") || s.includes("mission") || s.includes("goal") || s.includes("dream")) {
			return this.grammar.flatten("#startupIdea#")
		}

		if (s.includes("help") || s.includes("issue") || s.includes("problem")) {
			return this.grammar.flatten("#brokeSomething#")
		}

		if (s.includes("life") || s.includes("up") || s.includes("hey") || s.includes("hi") || s.includes("hello") || s.includes("ok") || s.includes("yes") || s.includes("no")) {
			return this.grammar.flatten("#lifeSummary#")
		}

		return `Let's talk about ${["startups", "my problems", "life updates"][Math.floor(Math.random() * 3)]} instead!`
	}
}