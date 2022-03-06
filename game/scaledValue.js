export default function scaledValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}