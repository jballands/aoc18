/**
 *	x abcd
 *	x accd
 *	x bbcc
 */

function compare(_original, _comparison) {
	const original = _original.split('');
	const comparison = _comparison.split('');

	let offByOneIndex = null;
	for (let i = 0; i < original.length; i++) {
		const originalLetter = original[i];
		const comparisonLetter = comparison[i];

		if (originalLetter === comparisonLetter) {
			continue;
		} else if (
			originalLetter !== comparisonLetter &&
			offByOneIndex === null
		) {
			offByOneIndex = i;
			continue;
		} else {
			return -1;
		}
	}

	return offByOneIndex;
}

module.exports = function(input) {
	const inputList = input.split('\n');

	for (let i = 0; i < inputList.length; i++) {
		for (let j = i + 1; j < inputList.length; j++) {
			const answer = compare(inputList[i], inputList[j]);

			if (answer > -1) {
				return `${inputList[i].slice(0, answer)}${inputList[i].slice(
					answer + 1
				)}`;
			}
		}
	}

	return null;
};
