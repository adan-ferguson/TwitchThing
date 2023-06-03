export default function(level){
  return {
    effect: {
      stats: {
        cooldownMultiplier: Math.pow(0.8, level)
      }
    },
    orbs: -1 + 5 * level
  }
}