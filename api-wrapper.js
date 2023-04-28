module.exports = {
	get_user_id,
	init_convo,
	get_question,
	reply
}

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

		const req = https.get(options, res => {
			const status_code = res.statusCode
			if(status_code < status_code || status_code >= 300) {
				const error = new Error(`Request for new question failed ${JSON.stringify({
					url: options.hostname + options.path,
					status_code
				}, null, "\t")}`)
				res.resume()
				reject(error)
			}

			let data = "";
			res.on("data", chunk => {
				data+=chunk
			})
			res.on("end", () => {
				try {
					const parsed = JSON.parse(data);
					resolve(parsed);
				} catch (e) {
					reject(e.message + ` | in ${data}`);
				}
			})
		})
		req.on("error", reject)
	}).then(obj => {
		const { messages } = obj
		return messages[messages.length - 1]["text"];
	}, error => console.error(error))
}

function reply(convo_id, answer) {
	return send_post_request(`/challenge-behaviour/${convo_id}`, JSON.stringify({
		"content": answer
	})).then(obj => obj["correct"])
}

function send_post_request(path, post_data) {
	return new Promise((resolve, reject) => {
		const options = create_options(path, "POST")

		const req = https.request(options, res => {
			const status_code = res.statusCode
			if(status_code < 200 || status_code >= 300) {
				const error = new Error(`POST request failed ${JSON.stringify({
					url: options.hostname + path,
					status_code,
					post_data
				}, null, "\t")}`)
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
					reject(e.message + ` | in ${data}`);
				}
			})
		})
		req.on("error", reject)
		req.write(post_data)
		req.end()
	}).catch(error => {
		throw error
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