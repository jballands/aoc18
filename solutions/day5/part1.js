//
//	How many units remain after fully reacting the polymer you scanned?
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

	return units.reduce((stack, unit) => {
		if (stack.size <= 0 || !doesReact(stack.last(), unit)) {
			return stack.push(unit);
		}
		return stack.pop();
	}, List()).size;
};
