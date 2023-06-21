export default function(level){
  return {
    effect: {
      stats: {
        cooldownMultiplier: 0.8 * Math.pow(0.87, level - 1)
      }
    },
    orbs: 2 + 2 * level
  }
}