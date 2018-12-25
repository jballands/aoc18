//
//	Starting with a frequency of zero, what is the resulting frequency after all of
//	the changes in frequency have been applied?
//

module.exports = function(input) {
	return input
		.split('\n')
		.map(val => parseInt(val))
		.reduce((sum, val) => sum + val);
};
