export default function scaledValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}

export function scaledValueCumulative(growthPct, iterations, base = 1){
  let total = base
  for(let i = 0; i < iterations; i++){
    total += Math.pow(growthPct + 1, i)
  }
  return total
}