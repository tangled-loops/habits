export function registerService<T>(name: string, init: () => T): T {
  // @ts-ignore
  if (!global[name]) {
    console.log('name not thar')
    // @ts-ignore
    global[name] = init();
  }

  // @ts-ignore
  return global[name];
}
