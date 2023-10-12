
export function registerService<T>(name: string, init: () => T) {
  if (!(name in global)) {
    // @ts-ignore
    global[name] = init()
  }
  // @ts-ignore
  return global[name];
}