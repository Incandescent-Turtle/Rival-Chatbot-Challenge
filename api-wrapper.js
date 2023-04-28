const https = require("https")
const BASE_URL = "code-challenge.us1.sandbox-rivaltech.io"

function get_user_id() {
	const data = JSON.stringify({
		"name": "Rory Macdonald",
		"email": "rorsmacd@gmail.com"
	})
	return send_request("/challenge-register", "POST", data).then(obj => obj["user_id"])
}

function init_convo(user_id) {
	const data = JSON.stringify({
		"user_id": user_id
	})
	return send_request("/challenge-conversation", "POST", data).then(obj => obj["conversation_id"])
}

function get_question(convo_id) {
	return send_request(`/challenge-behaviour/${convo_id}`, "GET").then(obj => {
		const { messages } = obj
		return messages[messages.length - 1]["text"];
	}, error => console.error(error))
}

//	Helper to reply the last question from the chatbot
function reply(convo_id, answer)
{
	const data = JSON.stringify({
		"content": answer
	})
	return send_request(`/challenge-behaviour/${convo_id}`, "POST", data).then(obj => obj["correct"])
}

//	Promise-based helper function to easily send https requests to the chatbot
function send_request(path, method, data = null) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: BASE_URL,
			path: path,
			method: method,
			headers: {
				"Content-Type": "application/json"
			}
		}

		const req = https.request(options, res =>
		{
			const status_code = res.statusCode
			if (status_code < 200 || status_code >= 300)
			{
				let err_msg = `${options.method} request to ${options.hostname + options.path} failed with status code ${status_code}`
				//	If data is being sent with this request, it is included in the error
				err_msg += data ? ` with data ${data}` : ""
				//	Free resources
				res.resume()
				reject(new Error(err_msg))
			}

			//	Combining data chunks

			let data_received = ""
			res.on("data", chunk =>
			{
				data_received += chunk
			})
			res.on("end", () =>
			{
					const parsed = JSON.parse(data_received);
					resolve(parsed);
			})
		})
		req.on("error", reject)
		if (data)
		{
			req.write(data)
		}
		req.end()
	});
}

module.exports = {
	get_user_id,
	init_convo,
	get_question,
	reply
}