//
//	How many square inches of fabric are within two or more claims?
//

const { Map } = require('immutable');

function process(line) {
	const regex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
	const [whole, id, x, y, width, height] = line.match(regex);

	return {
		id,
		x: parseInt(x),
		y: parseInt(y),
		width: parseInt(width),
		height: parseInt(height)
	};
}

function generatePoints(points, claim) {
	let _points = points;

	for (let x = claim.x; x < claim.x + claim.width; x++) {
		for (let y = claim.y; y < claim.y + claim.height; y++) {
			_points = _points.update(`${x},${y}`, 0, overlaps => overlaps + 1);
		}
	}
	return _points;
}

module.exports = function(input) {
	const claims = input.split('\n').map(claim => process(claim));

	return claims
		.reduce((reduction, point) => generatePoints(reduction, point), Map())
		.reduce((overlaps, point) => (point > 1 ? overlaps + 1 : overlaps), 0);
};
