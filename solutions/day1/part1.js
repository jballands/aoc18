module.exports = function(input) {
	return input
		.split('\n')
		.map(val => parseInt(val))
		.reduce((sum, val) => sum + val);
};
