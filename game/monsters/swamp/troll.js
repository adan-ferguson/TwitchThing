import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+60%',
    physPower: '+40%',
    speed: -80
  },
  items: [
    {
      name: 'Hyper Regeneration',
      abilities: {
        tick: {
          initialCooldown: 5000,
          description: 'Regenerate 15% of missing health.',
          actions: [
            gainHealthAction({
              scaling: { hpMissingPct: 0.15 }
            })
          ]
        }
      }
    }
  ]
}