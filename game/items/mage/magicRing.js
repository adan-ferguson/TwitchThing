export default function(level){
  return {
    effect: {
      stats: {
        cooldownMultiplier: 0.8 * Math.pow(0.87, level - 1) + 'x'
      }
    },
    orbs: 2 + 2 * level
  }
}