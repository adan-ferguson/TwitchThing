export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level + 3) + 'x',
        speed: -80 - 20 * level
      }
    },
    orbs: 5 * level + 5,
    loadoutModifiers: {
      neighbouring: {
        restrictions: {
          empty: true
        }
      }
    },
    vars: {
      affects: 'neighbouring'
    }
  }
}