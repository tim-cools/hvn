export function isLoading(value: any): value is Loading {
  return value?.isLoading === true;
}

export function hasValue<T>(value: any): value is T {
  return value != null && !isLoading(value);
}

export class Loading {
  isLoading = true;
}