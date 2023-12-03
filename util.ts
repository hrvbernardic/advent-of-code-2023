// import {readFileSync, promises as fsPromises} from 'fs';
import { promises as fsPromises } from 'fs';

export async function asyncReadFile(filename: string) {
  try {
    const contents = await fsPromises.readFile(filename, 'utf-8');
    return contents.split(/\r?\n/);
  } catch (err) {
    console.log(err);
  }
}

export const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );
