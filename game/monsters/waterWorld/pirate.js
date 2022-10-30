import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    hpMax: '-30%',
    physPower: '+10%'
  },
  items: [
    {
      name: 'Pistol Shot',
      abilities: {
        active: {
          initialCooldown: 8000,
          description: 'Attack for [P1.4] damage, with an extra 1/3 chance to crit.',
          actions: [
            attackAction({
              damageMulti: 1.5,
              extraCritChance: 1/3
            })
          ]
        }
      }
    }
  ]
}