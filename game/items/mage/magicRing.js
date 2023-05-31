export default function(level){
  return {
    effect: {
      stats: {
        cooldownTime: Math.pow(0.7, level)
      }
    },
    orbs: 6 * level
  }
}