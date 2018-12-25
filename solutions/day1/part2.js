//
//	What is the first frequency your device reaches twice?
//

module.exports = function(input) {
	input = input.split('\n').map(val => parseInt(val));

	let sum = 0;
	let memoized = {};
	let index = 0;

	while (true) {
		sum = sum + parseInt(input[index % input.length]);

		if (memoized[sum]) {
			break;
		}

		memoized[sum] = true;
		index++;
	}

	return sum;
};
