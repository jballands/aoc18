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

	const withoutTwos = counts.filter(
		boxCounts => boxCounts.filter(count => count !== 2).size === 0
	);

	const withoutThrees = counts.filter(
		boxCounts => boxCounts.filter(count => count !== 3).size === 0
	);

	console.log(withoutTwos.toJS());

	console.log(withoutThrees.toJS());

	return (
		(counts.size - withoutTwos.size) *
		(withoutTwos.size - withoutThrees.size)
	);
};
