import attackAction from '../../actions/actionDefs/common/attack.js'

export default {
  baseStats: {
    hpMax: '-20%',
    magicPower: '+110%',
    physPower: '-40%'
  },
  items: [
    {
      name: 'Lightning Bolt',
      abilities: {
        active: {
          initialCooldown: 4000,
          cooldown: 8000,
          actions: [
            attackAction({
              damageMulti: 2,
              range: [0, 1],
              damageType: 'magic'
            })
          ]
        }
      }
    }
  ]
}