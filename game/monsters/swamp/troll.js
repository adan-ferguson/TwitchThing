import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+20%',
    physPower: '+10%',
    physDef: '+30%',
    speed: '-40%'
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
              pctMissing: 0.15
            })
          ]
        }
      }
    }
  ]
}