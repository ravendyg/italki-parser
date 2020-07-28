export function asyncWait(period: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, period);
  });
}
