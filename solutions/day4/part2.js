//
//	What is the ID of the guard you chose multiplied by the minute you chose?
//

const { Map, List } = require('immutable');

function dateAsString(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function explodeDates(dateA, dateB) {
	let explosion = Map();
	const minuteA = dateA.getMinutes();
	const minuteB = dateB.getMinutes();

	for (let minute = minuteA; minute < minuteB; minute++) {
		explosion = explosion.update(minute, 0, ticks => ticks + 1);
	}

	return explosion;
}

function mergeGuardRecords(to, from) {
	return to.mergeWith((toVal, fromVal) => toVal + fromVal, from);
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

// Makes a map of maps, where each top-level map represents a guard
// and each item in that map reprsents a minute and how many times
// they were asleep during that minute.
//
// {
//     "10": {
//         "00": 1,
//         "01": 3,
//         "02": 2,
//     }
// }
function createSleepChart(schedule) {
	let currentId = null;
	let asleepAt = null;

	return schedule.reduce((sleepChart, eventList) => {
		const subchart = eventList.reduce((subSleepChart, event) => {
			const { date, action } = event;

			// If a guard starts working, reinitialize counters
			const beginShiftMatch = action.match(/Guard #(\d+) begins shift/);
			if (beginShiftMatch) {
				currentId = beginShiftMatch[1];
				asleepAt = null;
				return subSleepChart;
			}
			// If a guard falls asleep, record the start time
			else if (action === 'falls asleep') {
				asleepAt = date;
				return subSleepChart;
			}
			// When the guard wakes up, "explode" the dates and then merge it
			// into their record
			else if (action === 'wakes up') {
				const subrecord = explodeDates(asleepAt, date);
				asleepAt = null;
				return subSleepChart.update(currentId, Map(), record =>
					mergeGuardRecords(record, subrecord)
				);
			}
		}, Map());

		asleepAt = null;
		return sleepChart.mergeWith(
			(record, subRecord) => mergeGuardRecords(record, subRecord),
			subchart
		);
	}, Map());
}

module.exports = function(input) {
	const calendar = Map();
	const events = input.split('\n').map(line => processLine(line));

	const schedule = scheduleEvents(events);
	const sleepChart = createSleepChart(schedule);

	// For simplicity, we'll form Lists of the most frequent minutes
	const mostFrequentMinutes = sleepChart.reduce(
		(mostFrequentList, record, id) => {
			return mostFrequentList.push(
				record.reduce((most, hits, minute) => {
					if (!most) {
						return Map({
							id,
							minute,
							hits
						});
					}

					return most.get('hits') > hits
						? most
						: Map({
								id,
								minute,
								hits
						  });
				}, null)
			);
		},
		List()
	);

	// Now, simply find the item with the most hits
	const { id, minute } = mostFrequentMinutes
		.reduce((most, guard) => {
			if (most.get('hits') > guard.get('hits')) {
				return most;
			}
			return guard;
		})
		.toJS();

	return parseInt(id) * minute;
};
