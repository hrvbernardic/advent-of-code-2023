import {createInterface} from "readline";
import {join} from "path";
import {createReadStream} from "fs";

const fileStream = createReadStream(join(__dirname, 'input.txt'));

const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let calibrationValues = [];

rl.on('line', (line: string) => {
    calibrationValues.push(getCalibrationValue(line));
});

rl.on('close', () => {
    const sum = calibrationValues.reduce((sum, value) => sum + value, 0);
    console.log(sum);
});

function getCalibrationValue(text: string) {
    const numbers = text.replace(/[^0-9]/g, '');
    return parseInt(`${numbers.at(0)}${numbers.at(-1)}`, 10);
}



