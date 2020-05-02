export function parseQuery<T>(args: Set<string>): Partial<T> {
  // @ts-ignore
  const loc = window.location;
  if (!loc.search) {
    return {};
  }

  const res: any = {};
  loc.search
    .slice(1, loc.search.length)
    .split('&')
    .map(item => item.split('='))
    .forEach(([key, val]) => {
      if (args.has(key)) {
        res[key] = val;
      }
    });

  return res;
}
