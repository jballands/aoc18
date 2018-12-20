# Advent of Code 2018

These are my solutions to the coding problems for [Advent of Code 2018](https://adventofcode.com/2018). They are written in Javascript.

Solutions © 2018 Jonathan Ballands  
Advent of Code © 2018 Eric Wastl

## Usage

```
yarn|npm solve <dayNumber> <partNumber> --input <inputFile> --help
```

`--day`: The day to run.  
`--part`: The part to run.  
`--help`: Show usage information.

To solve a day, create a directory in `solutions` with the day number, then create a Javascript file corresponding to the part. Create an `input` file with your puzzle input in it; that `input` will be fed whatever function is exported from your part file:

#### Directory Structure

```
solutions
├── day1
│   ├── part1.js
│   ├── part2.js
│   └── input
├── day2
│   └── ...
└── ...
```

#### Example Solution File

```js
module.exports = function(input) {
	// Solve the puzzle here
};
```
