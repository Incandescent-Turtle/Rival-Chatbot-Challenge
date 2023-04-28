const bot = require("./api-wrapper")
const parser = require("./parser")
const team_handler = require("./teams")

const YES_QUESTIONS = [
	"Are you ready to begin?",
	"Great! Are you ready to continue to some word questions?",
	"Are you ready to go?"
]

console.log("Registering User...")
bot.get_user_id().then(user_id => {
	console.log("Initiating Conversation...")
	bot.init_convo(user_id).then(async convo_id => {
		console.log("Retrieving First Question...")
		let question = await bot.get_question(convo_id);

		while(!(question.includes("Thank you")))
		{
			console.log(`Q) ${question}`)
			let answer = ""
			let response = false;

			if(YES_QUESTIONS.includes(question)) {
				answer = "yes"
			} else if(question.startsWith("What is the sum of the following numbers:")) {
				const nums = parser.parse_num_list(question)
				const sum = nums.reduce((acc, curr) => acc + curr)
				answer = `${sum}`
			} else if(question.startsWith("What is the largest of the following numbers")) {
				const nums = parser.parse_num_list(question)
				const largest = Math.max(...nums)
				answer = `${largest}`
			} else if(question.startsWith("Please repeat only the words with an even number of letters:")) {
				let arr = parser.parse_str_list(question)
				arr = arr.filter(str => str.length%2 === 0)
				answer = arr.toString()
			} else if(question.startsWith("Please alphabetize the following words:")) {
				let arr = parser.parse_str_list(question)
				arr.sort((a,b) => a.localeCompare(b, {'sensitivity': 'base'}))
				answer = arr.toString()
			} else if(question.startsWith("Which of the following is a")) {
				const teams = parser.parse_str_list(question)
				//	Finding the sport/league (identifier) the question is asking about
				//	The question up until the ":"
				const first_half = question.split(":")[0].trim().split(/\s+/)
				// ID is the second to last word before the colon :
				const id = first_half[first_half.length-2]

				//	Whether the question is asking about a team or a league
				if(team_handler.sports.includes(id)) {
					answer = team_handler.which_plays_sport(teams, id)
				} else if(team_handler.leagues.includes(id)) {
					answer = team_handler.which_in_league(teams, id)
				}
			} else if(question.startsWith("What sports teams in the data set were established in")) {
				//	Matches the date (only number in the question)
				const date = question.match(/[0-9]+/)
				answer = team_handler.teams_founded_in(date).toString()
			}

			console.log(`A) "${answer}"`)
			response = await bot.reply(convo_id, answer)

			if(response === false) {
				console.error(`Incorrect answer "${answer}" for question: ${question}`)
				break;
			} else {
				console.log("Correct")
			}
			question = await bot.get_question(convo_id);
		}
		if(question.includes("Thank you")) {
			console.log("Completed. Two robots just spoke.")
		}
	})
}).catch(error => console.error(error))