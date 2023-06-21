export default function(level){
  const factor = level + 1
  return {
    effect: {
      stats: {
        critChance: (1 / factor) + 'x',
        critDamage: factor + 'x'
      }
    }
  }
}