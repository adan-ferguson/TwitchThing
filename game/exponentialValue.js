export function exponentialValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}

export function exponentialValueCumulative(growthPct, iterations, base = 1){
  let total = 0
  for(let i = 0; i < iterations; i++){
    total += base * Math.pow(growthPct + 1, i)
  }
  return total
}