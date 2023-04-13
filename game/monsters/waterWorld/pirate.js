import attackAction from '../../actions/actionDefs/common/attack.js'

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
          description: 'Attack for [physScaling1.7] damage, 1/3 chance to crit.',
          actions: [
            attackAction({
              damageMulti: 1.7,
              extraCritChance: 1/3
            })
          ]
        }
      }
    }
  ]
}