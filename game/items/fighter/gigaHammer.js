export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level + 3) + 'x',
        speed: -75 - 25 * level
      }
    },
    orbs: 4 * level + 6,
    loadoutModifiers: [{
      loadoutModifierId: 'big',
      subjectKey: 'neighbouring',
      restrictions: {
        empty: true
      }
    }]
  }
}