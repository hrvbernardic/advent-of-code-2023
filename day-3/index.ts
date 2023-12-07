import { arrayRange, asyncReadFile } from '../util.ts';

interface NumberPosition {
  rowIndex: number;
  columnRange: [number, number];
  value: number;
  part: boolean;
  surroundingCoordinates: [number, number][];
}

const engineMap = await asyncReadFile(new URL('input.txt', import.meta.url));

const partNumbersSum = getPartNumbersSum(engineMap);
console.log(partNumbersSum);

const gearRatiosSum = getGearRatiosSum(engineMap);
console.log(gearRatiosSum);

//

export function getGearRatiosSum(engineMap: string[]) {
  const gearIndices: [number, number][] = [];
  let gearRatiosSum = 0;
  const numberPositions = getNumberPositions(engineMap);

  engineMap.forEach((row, rowIndex) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '*') gearIndices.push([rowIndex, i]);
    }
  });

  gearIndices.forEach((gearIndice) => {
    const [x, y] = gearIndice;

    const gearNumberPositions = numberPositions.filter((p) => {
      return p.surroundingCoordinates.some(([xx, yy]) => xx === x && yy === y);
    });

    if (gearNumberPositions.length > 1) {
      gearRatiosSum += gearNumberPositions.reduce(
        (acc, curr) => acc * curr.value,
        1,
      );
    }
  });

  return gearRatiosSum;
}

export function getPartNumbersSum(engineMap: string[]) {
  const numberPositions = getNumberPositions(engineMap);
  const partNumberPositions = numberPositions.filter((p) => p.part);

  return partNumberPositions.reduce((sum, curr) => sum + curr.value, 0);
}

export function getNumberPositions(engineMap: string[]) {
  const positions: NumberPosition[] = [];

  engineMap.forEach((row, rowIndex) => {
    for (let y = 0; y < row.length; y++) {
      if (isNumber(row[y])) {
        const position: NumberPosition = {
          rowIndex,
          columnRange: [y, y],
          value: 0,
          part: false,
          surroundingCoordinates: [],
        };
        while (isNumber(row[position.columnRange[1] + 1])) {
          position.columnRange[1] += 1;
        }

        position.value = getNumberFromPosition(position, engineMap);
        position.surroundingCoordinates = getSurroundingPositions(
          position,
          engineMap,
        );
        position.part = isPartNumber(position, engineMap);

        positions.push(position);
        y += position.columnRange[1] - position.columnRange[0] + 1;
      }
    }
  });

  return positions;
}

export function isPartNumber(position: NumberPosition, engineMap: string[]) {
  return position.surroundingCoordinates.some(
    ([x, y]) =>
      !isNumber(engineMap[x][y]) &&
      engineMap[x][y] !== '.' &&
      engineMap[x][y] !== undefined,
  );
}

export function getSurroundingPositions(
  position: NumberPosition,
  engineMap: string[],
) {
  const {
    rowIndex,
    columnRange: [start, end],
  } = position;

  let surroundingCoordinates: [number, number][] = [];

  const yStart = start > 0 ? start - 1 : start;
  const yEnd = end === engineMap[0].length - 1 ? end : end + 1;
  const yCoordinates = arrayRange(yStart, yEnd);

  if (rowIndex > 0) {
    surroundingCoordinates.push(
      ...yCoordinates.map((y) => [rowIndex - 1, y] satisfies [number, number]),
    );
  }

  if (start > 0) {
    surroundingCoordinates.push([rowIndex, start - 1]);
  }

  if (end < engineMap[0].length - 1) {
    surroundingCoordinates.push([rowIndex, end + 1]);
  }

  if (rowIndex < engineMap.length - 1) {
    surroundingCoordinates.push(
      ...yCoordinates.map((y) => [rowIndex + 1, y] satisfies [number, number]),
    );
  }

  return surroundingCoordinates;
}

export function getNumberFromPosition(
  position: NumberPosition,
  engineMap: string[],
) {
  const {
    rowIndex,
    columnRange: [start, end],
  } = position;
  return parseInt(engineMap[rowIndex].substring(start, end + 1));
}

export function isNumber(value: string) {
  return Number.isInteger(parseInt(value));
}
