import attackAction from '../../actions/attackAction.js'

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
          initialCooldown: 5000,
          actions: [
            attackAction({
              damageRange: { min: 0, max: 2 },
              damageType: 'magic'
            })
          ]
        }
      }
    }
  ]
}