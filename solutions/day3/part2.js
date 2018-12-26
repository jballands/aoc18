//
//	What is the ID of the only claim that doesn't overlap?
//

const { List, Map } = require('immutable');

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
			_points = _points.update(`${x},${y}`, List(), l => {
				return l.push(claim.id);
			});
		}
	}
	return _points;
}

// This has awful time complexity... but I don't know if I care? Give this
// puppy like, a full minute to execute. It's also riddled with side-effects...
module.exports = function(input) {
	const claims = input.split('\n').map(claim => process(claim));
	let allIds = List(claims.map(claim => claim.id));

	// A sheet is a 2D
	const sheet = claims.reduce(
		(reduction, point) => generatePoints(reduction, point),
		Map()
	);

	sheet.map(point => {
		// If theres more than one claim for this point, trash it
		if (point.size > 1) {
			point.map(p => {
				allIds = allIds.filter(i => i !== p);
			});
		}
	});

	return allIds;
};
