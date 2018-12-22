const { Map } = require('immutable');

module.exports = function(input) {
	const counts = input.split('\n').reduce((boxCounts, box) => {
		const letterCounts = box
			.split('')
			.reduce(
				(counts, letter) =>
					counts.update(letter, 0, count => count + 1),
				Map()
			);
		return boxCounts.set(box, letterCounts);
	}, Map());

	const twos = counts.filter(boxCounts => boxCounts.includes(2)).size;
	const threes = counts.filter(boxCounts => boxCounts.includes(3)).size;

	return twos * threes;
};
