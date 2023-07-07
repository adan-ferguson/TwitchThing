
export default function(level){
  const damageThreshold = 0.1 * level
  return {
    effect: {
      stats: {
        damageThreshold
      }
    },
    orbs: level * 8 + 4
  }
}