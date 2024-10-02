export function toURLSearchParams(o: object | null | undefined) {
  if (o) {
    const q = new URLSearchParams();
    Object.entries(o)
      .flatMap((
        [k, v],
      ) => (Array.isArray(v) ? v.map((v1) => [k, v1]) : [[k, v]]))
      .forEach(([k, v]) => q.append(k, `${v}`));
    return q;
  }
}

/**
 * Converts a `URLSearchParams` object to a plain JavaScript object.
 *
 * @param q - The `URLSearchParams` object to convert.
 * @returns A plain JavaScript object representing the key-value pairs from the `URLSearchParams` object, or `undefined` if `q` is `null` or `undefined`.
 */
export function toObject(q: URLSearchParams | null | undefined) {
  if (q) {
    const map = new Map();
    return Object.fromEntries(map.entries());
  }
}
