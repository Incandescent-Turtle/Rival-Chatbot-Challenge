const parser = require('./parser');

//	str parsing
test('basic string parsing', () => {
	expect(parser.parse_str_list("this is a question: these, are, the, test, strs")).toStrictEqual(["these","are","the","test","strs"]);
});
test('whitespace trimming between/around strs', () => {
	expect(parser.parse_str_list("this is a question:    these,  are,    the,     test, strs     ")).toStrictEqual(["these","are","the","test","strs"]);
});
test('keeping whitespace within strs', () => {
	expect(parser.parse_str_list("this is a question:    the  se,  are,    t he,     test, s t rs     ")).toStrictEqual(["the  se","are","t he","test","s t rs"]);
});
test('ending with "?"', () => {
	expect(parser.parse_str_list("this is a question: apple,toe,banana?")).toStrictEqual(["apple","toe","banana"]);
});
test('ending with "."', () => {
	expect(parser.parse_str_list("this is a question: apple,toe,banana.")).toStrictEqual(["apple","toe","banana"]);
});

// num parsing
test('numbers', () => {
	expect(parser.parse_num_list("this is a question: 1,2,3,4.")).toStrictEqual([1,2,3,4]);
});
test('negative numbers', () => {
	expect(parser.parse_num_list("this is a question: -1,2,3,-4.")).toStrictEqual([-1,2,3,-4]);
});
test('decimal numbers', () => {
	expect(parser.parse_num_list("this is a question: 1.001,2,3,4.3")).toStrictEqual([1.001,2,3,4.3]);
});