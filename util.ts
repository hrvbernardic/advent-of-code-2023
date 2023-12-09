export async function asyncReadFile(filename: string | URL) {
  try {
    const fileText = await Bun.file(filename).text()
    return fileText.split(/\r?\n/) ?? []
  } catch (err) {
    console.log(err)
    return []
  }
}

export function arrayRange(start: number, stop: number, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  )
}
