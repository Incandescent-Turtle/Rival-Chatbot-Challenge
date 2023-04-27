exports.get_user_id = get_user_id
exports.init_convo = init_convo
exports.get_question = get_question
exports.reply = reply

const https = require("https")
const BASE_URL = "code-challenge.us1.sandbox-rivaltech.io"

function get_user_id() {
	const data = JSON.stringify({
		"name": "Rory Macdonald",
		"email": "rorsmacd@gmail.com"
	})
	return send_post_request("/challenge-register", data).then(obj => obj["user_id"])
}

function init_convo(user_id) {
	const data = JSON.stringify({
		"user_id": user_id
	})
	return send_post_request("/challenge-conversation", data).then(obj => obj["conversation_id"])
}

function get_question(convo_id) {
	return new Promise((resolve, reject) => {
		const options = create_options(`/challenge-behaviour/${convo_id}`, "GET")
		const req = create_client_request(options, resolve, reject)
		req.end()
	}).then(obj => {
		const { messages } = obj
		return messages[messages.length - 1]["text"];
	})
}

function reply(convo_id, answer) {
	return send_post_request(`/challenge-behaviour/${convo_id}`, JSON.stringify({
		"content": answer
	})).then(obj => obj["correct"])
}

function create_client_request(options, resolve, reject) {
	const req = https.request(options, res => {
		const { statusCode } = res
		if(statusCode < 200 || statusCode >= 300) {
			const error = new Error(`Request to ${options.hostname + options.path} failed with status code: ${statusCode}`)
			res.resume()
			reject(error)
		}

		let data = ""
		res.on("data", chunk => {
			data+=chunk
		})
		res.on("end", () => {
			try {
				const parsed = JSON.parse(data);
				resolve(parsed);
			} catch (e) {
				reject(e.message);
			}
		})
	})
	req.on("error", reject)
	return req
}

function send_post_request(path, data) {
	return new Promise((resolve, reject) => {
		const options = create_options(path, "POST")
		const req = create_client_request(options, resolve, reject)
		req.write(data)
		req.end()
	})
}

function create_options(path, method)
{
	return {
		hostname: BASE_URL,
		path: path,
		method: method,
		headers: {
			"Content-Type": "application/json"
		}
	}
}