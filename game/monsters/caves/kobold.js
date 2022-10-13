import attackAction from '../../actions/attackAction.js'

export default {
  description: 'Like a small lizard person.',
  baseStats: {
    physPower: '-30%',
    physDef: '+20%',
    speed: '+11%'
  },
  items: [
    {
      name: 'Skewer',
      abilities: {
        active: {
          cooldown: 10000,
          initialCooldown: 10000,
          actions: [
            attackAction({
              damageMulti: 2.4
            })
          ]
        }
      },
      mods: ['physScaling']
    }
  ]
}