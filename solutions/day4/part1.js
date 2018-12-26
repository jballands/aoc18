//
//	What is the ID of the guard you chose multiplied by the minute you chose?
//

const { Map, List } = require('immutable');

function dateAsString(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function processLine(line) {
	const regex = /\[([12]\d{3}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]) (?:[0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])\] ([a-zA-Z0-9_# ]*)$/;
	const [whole, date, action] = line.match(regex);
	return {
		date: new Date(date),
		action
	};
}

// Makes a map of lists of events that organizes each event into a
// date "bucket" and sorts it into its place in the event list.
//
// {
//     "1518-03-04": [{ ... }, { ... }]
// }
function scheduleEvents(events) {
	return events.reduce((schedule, event) => {
		const eventList = schedule.get(dateAsString(event.date));

		// If there is no key, it's the first action in the list
		if (!eventList) {
			return schedule.set(dateAsString(event.date), List([event]));
		}

		// If there is a key, then insert it into the correct position
		let position = 0;
		let current = eventList.get(0);
		while (
			position < eventList.size &&
			eventList.get(position).date < event.date
		) {
			position++;
		}

		return schedule.set(
			dateAsString(event.date),
			eventList.insert(position, event)
		);
	}, Map());
}

module.exports = function(input) {
	const calendar = Map();
	const events = input.split('\n').map(line => processLine(line));

	const schedule = scheduleEvents(events);
};
