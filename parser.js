//	Used to parse values after ":" into a str list
function parse_str_list(message) {
	//	Removes any "?" or "." at the end of the question
	const last_char = message.charAt(message.length-1)
	if(last_char === "." || last_char === "?") {
		message = message.substring(0, message.length-1)
	}
	//	Splits the question after the ":" and splits it into an array of CSV
	let arr = message.split(":")[1].split(",")
	arr = arr.map(str => str.trim())
	return arr
}

//	Used to parse values after ":" into a float list
function parse_num_list(message) {
	let arr = parse_str_list(message)
	return arr.map(str => parseFloat(str))
}

module.exports = {
	parse_str_list,
	parse_num_list
}