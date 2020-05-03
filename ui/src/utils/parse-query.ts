export function parseQuery<T>(args: {[key: string]: boolean}): T | null {
  // @ts-ignore
  const loc = window.location;
  const res: any = {};

  loc.search
    .replace(/^\?/, '')
    .split('&')
    .map(item => item.split('='))
    .forEach(([key, val]) => {
      if (typeof args[key] === 'boolean') {
        res[key] = val;
      }
    });

  for (const key of Object.keys(args)) {
    if (args[key] && !res[key]) {
      return null;
    }
  }

  return res;
}
