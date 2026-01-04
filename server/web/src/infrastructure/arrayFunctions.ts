
export function addRange<TItem, TResult>(destination: Array<TResult>, source: ReadonlyArray<TItem>, selectMany: (value: TItem) => ReadonlyArray<TResult>): void {
  for (const item of source) {
    const values = selectMany(item);
    values.forEach(value => destination.push(value));
  }
}

export function take<TItem>(array: ReadonlyArray<TItem>, amount: number) {
  return array.slice(0, amount);
}

export function singleOrDefault<TItem>(array: ReadonlyArray<TItem>, where: ((value: TItem) => boolean) | null = null): TItem | null {
  if (where == null) {
    if (array.length > 1) throw new Error("More as one element found in array.");
    return array.length == 1 ? array[0] : null;
  }
  let value: TItem | null = null;
  for (const item of array) {
    if (where(item)) {
      if (value == null) {
        value = item;
      } else {
        throw new Error("More as one element found in array.");
      }
    }
  }
  return value;
}