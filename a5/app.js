


// Do setup
document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el: "#app",
		template: `<div id="app">
			<chat-widget :messages="messages" />

			<div id="controls">
				<div>
					<input ref="input" v-model="currentInput" @keyup="sayKey" @keyup.enter="enterInput">
					
					<button @click="enterInput">âŠī¸</button>
				</div>
				<div>
					<button @click="handleInput('life')">life</button>
					<button @click="handleInput('help')">help</button>
					<button @click="handleInput('startup')">startup</button>
				</div>
			

			</div>

			{{currentInput}}
		</div>`,

		watch: {
			// currentInput() {
			// 	console.log('Input is now', this.currentInput)
			// },

			messages() {
				// console.log("messages", this.messages)
			}
		},

		methods: {
			sayKey() {
				console.log("KEY")
			},

			postToChat(text, owner, isSelf) {
				this.messages.push({
					text: text,
					isSelf: isSelf,
					owner: owner,
				})
			},

			enterInput() {
				let text = this.currentInput
				this.currentInput = ""

				
				this.handleInput(text)

			},

			handleInput(text) {
				if (text === 'help') {
					text = "Can I help with something?"
				}
				if (text === 'startup') {
					text = "What's your startup idea?"
				}
				if (text === 'life') {
					text = "What's up?"
				}
				// Does bot things
				this.postToChat(text, "đ", true)

				// Add to the messages in chat
			
				// Bot does something
				let output = this.bot.respondTo(text)

				setTimeout(() => {
					this.postToChat(output, "đ")
					
				}, Math.random()*100 + 400)

			}
		},

		mounted() {

			console.log("Vue app is all set up....")
			setInterval(() => {
				// this.currentInput = randomMessage()

			}, 1000)

			this.bot.post = (text) =>  {
				// this is now the vue object
				this.postToChat(text, "âī¸")
			}

		},
		

		data() {
			return {
				// Store the bot
				bot: new InternBot(),

				// And the message
				messages: [],

				// And the current thing in the input
				currentInput: ""
			}
		}
	})	
})
