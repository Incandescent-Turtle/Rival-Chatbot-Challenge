const {get_question} = require("./api-wrapper");
api = require("./api-wrapper")
parser = require("./parser")

const YES_QUESTIONS = [
	"Are you ready to begin?",
	"Great! Are you ready to continue to some word questions?",
	"Are you ready to go?"
]

api.get_user_id().then(user_id => {
	api.init_convo(user_id).then(async function(convo_id) {
		let question = "";
		while(!(question.includes("Thank you")))
		{
			question = await get_question(convo_id)
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
			} if(question.startsWith("Please alphabetize the following words:")) {
				let arr = parser.parse_str_list(question)
				arr.sort((a,b) => a.localeCompare(b, {'sensitivity': 'base'}))
				answer = arr.toString()
			}
			response = await api.reply(convo_id, answer)
			if(response == false) {
				console.error(`Incorrect answer "${answer}" for question: ${question}`)
				break;
			} else {
				console.log(response)
			}
		}
	})
})