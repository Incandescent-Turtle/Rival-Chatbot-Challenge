exports.parse_str_list = parse_str_list
exports.parse_num_list = parse_num_list
function parse_str_list(message) {
	let arr = message.split(":")[1].split(",")
	arr = arr.map(str => {
		str = str.trim()
		const last = str.charAt(str.length-1)
		if(last === "?" || last === ".") {
			str = str.substring(0, str.length-1)
		}
		return str
	})
	return arr
}
function parse_num_list(message) {
	let arr = parse_str_list(message)
	return arr.map(str => parseInt(str))
}
