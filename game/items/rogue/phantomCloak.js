
export default function(level){
  return {
    effect: {
      stats: {
        damageCeiling: 0.5 * Math.pow(0.9, level - 1)
      }
    },
    orbs: level * 4 + 2
  }
}