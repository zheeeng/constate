export function parseState(prev: any, next: any) {
  return typeof next === "function" ? next(prev) : next;
}
