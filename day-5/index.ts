import { asyncReadFile } from '../util.ts';

const input =
  (await asyncReadFile(new URL('input.txt', import.meta.url))) ?? [];

const seedNumbers = getSeedNumbers(input);
const mappingTable = getMappingTable(input);
const lowestLocationNumber = getLowestLocationNumber(seedNumbers, mappingTable);
const lowestLocationFromRanges = getLowestLocationFromSeedRanges(
  seedNumbers,
  mappingTable,
);

console.log(lowestLocationNumber, lowestLocationFromRanges);

//

function getLowestLocationNumber(
  seedNumbers: number[],
  mappingTable: MappingTable,
) {
  const locationNumbers = seedNumbers.map((num) => ({
    num,
    location: getLocationNumber(num, mappingTable),
  }));

  return locationNumbers.sort((a, b) => a.location - b.location)[0].location;
}

function getLocationNumber(seedNumber: number, mappingTable: MappingTable) {
  const mappings = Object.values(mappingTable);

  return mappings.reduce((location, map) => {
    const oldLocation = location;
    map.forEach((m) => {
      const diff = oldLocation - m.sourceRangeStart;
      const index = diff >= 0 && diff < m.count ? diff : -1;

      if (index >= 0) {
        location = m.destinationRangeStart + index;
      }
    });

    return location;
  }, seedNumber);
}

function getLowestLocationFromSeedRanges(
  seedNumbers: number[],
  mappingTable: MappingTable,
) {
  let index = 0;
  let lowestLocation = Infinity;

  while (index < seedNumbers.length) {
    const from = seedNumbers[index];
    let count = seedNumbers[index + 1];

    while (count-- > 0) {
      const locNum = getLocationNumber(from + count, mappingTable);
      if (locNum < lowestLocation) lowestLocation = locNum;
    }
    index += 2;
  }

  return lowestLocation;
}

function getSeedNumbers(input: string[]) {
  return input[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((s) => s.length)
    .map((n) => parseInt(n));
}

interface MappingTable {
  [id: string]: Mapping[];
}

interface Mapping {
  destinationRangeStart: number;
  sourceRangeStart: number;
  count: number;
}

function getMappingTable(input: string[]) {
  let tablesMap: MappingTable = {};

  for (let i = 0; i <= input.length; i++) {
    const line = input[i];
    if (i === 0 || !line || !line.length) continue;

    if (line.includes(':')) {
      const tableId = line.split(':')[0];
      tablesMap[tableId] = [];
      let j = i + 1;
      while (input[j] && !input[j]?.includes(':')) {
        const [destinationRangeStart, sourceRangeStart, count] = input[j]
          .split(' ')
          .filter((l) => l.length)
          .map((n) => parseInt(n));
        tablesMap[tableId].push({
          destinationRangeStart,
          sourceRangeStart,
          count,
        });
        j++;
      }
      i = j - 1;
    }
  }

  return tablesMap;
}
