export function tpCostForPoints(n: number): number {
  const fullBlocks = Math.floor(n / 4);
  const remainder = n - fullBlocks * 4;
  return 2 * fullBlocks * (fullBlocks + 1) + remainder * (fullBlocks + 1);
}