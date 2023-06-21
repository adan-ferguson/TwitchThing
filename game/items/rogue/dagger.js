export default function(level){
  return {
    effect: {
      stats: {
        critChance: 0.07 + level * 0.03
      }
    },
    orbs: level * 1
  }
}