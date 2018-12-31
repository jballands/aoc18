//
//	What is the length of the shortest polymer you can produce by removing all units of exactly
//	one type and fully reacting the result?
//

const { List } = require('immutable');

const UNICODE_OFFSET = 32;

function doesReact(a, b) {
	return (
		a.charCodeAt(0) - UNICODE_OFFSET === b.charCodeAt(0) ||
		b.charCodeAt(0) - UNICODE_OFFSET === a.charCodeAt(0)
	);
}

module.exports = function(input) {
	const units = input.split('');

	const polymerLengths = [...Array(26).keys()].map(charCode => {
		const upper = String.fromCharCode(65 + charCode);
		const lower = upper.toLowerCase();

		return units
			.filter(unit => unit !== upper && unit !== lower)
			.reduce((stack, unit) => {
				if (stack.size <= 0 || !doesReact(stack.last(), unit)) {
					return stack.push(unit);
				}
				return stack.pop();
			}, List()).size;
	});

	return polymerLengths.reduce(
		(smallest, length) => (smallest > length ? length : smallest),
		Infinity
	);
};
