export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level + 3) + 'x',
        speed: -75 - 25 * level
      }
    },
    orbs: 4 * level + 6,
    loadoutModifiers: {
      neighbouring: {
        restrictions: {
          empty: true
        }
      }
    }
  }
}