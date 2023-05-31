export default function(level){
  return {
    loadoutModifiers: {
      attached: {
        levelUp: level
      }
    },
    orbs: 9 * level,
    vars: {
      targets: 'attached'
    }
  }
}