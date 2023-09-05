export default function(level){
  return {
    effect: {
      stats: {
        cooldownMultiplier: 0.85 * Math.pow(0.92, level - 1) + 'x'
      }
    },
    orbs: 2 + 2 * level
  }
}