export default function(level){
  return {
    effect: {
      stats: {
        damageCeiling: 0.35 * Math.pow(0.85, level - 1)
      },
    },
  }
}