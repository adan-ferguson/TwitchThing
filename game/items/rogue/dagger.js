export default function(level){
  return {
    effect: {
      stats: {
        critChance: 0.05 + level * 0.05
      }
    },
    orbs: level * 1
  }
}