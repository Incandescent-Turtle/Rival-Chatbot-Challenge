const {get_question} = require("./api-wrapper");
const api = require("./api-wrapper")
const parser = require("./parser")
const teams = require("./teams")

const YES_QUESTIONS = [
	"Are you ready to begin?",
	"Great! Are you ready to continue to some word questions?",
	"Are you ready to go?"
]

api.get_user_id().then(user_id => {
	api.init_convo(user_id).then(async convo_id => {
		let question = await get_question(convo_id);
		while(!(question.includes("Thank you")))
		{
			console.log(question)
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
				arr = arr.filter(str => str.length%2 == 0)
				answer = arr.toString()
			} else if(question.startsWith("Please alphabetize the following words:")) {
				let arr = parser.parse_str_list(question)
				arr.sort((a,b) => a.localeCompare(b, {'sensitivity': 'base'}))
				answer = arr.toString()
			} else if(question.startsWith("Which of the following is a")) {
				const team_choices = parser.parse_str_list(question)
				//	Finding the sport/league (identifier) the question is asking about
				const first_half = question.split(":")[0].trim().split(/\s+/)
				const id = first_half[first_half.length-2]

				if(teams.get_sports().has(id)) {
					answer = teams.which_of_sport(id, team_choices)
				} else if(teams.get_leagues().has(id)) {
					answer = teams.which_in_league(id, team_choices)
				} else {
					const err = `${id} is not a valid team nor league`
					console.error(err)
					answer = ""
				}
			} else if(question.startsWith("What sports teams in the data set were established in")) {
				const date = question.match(/[0-9]+/)
				answer = teams.founded_in(date).toString()
			}

			response = await api.reply(convo_id, answer)

			if(response == false) {
				console.error(`Incorrect answer "${answer}" for question: ${question}`)
				break;
			} else {
				console.log(response)
			}
			question = await get_question(convo_id);
		}
		console.log("done")
	}).catch(error => console.error(error))
})