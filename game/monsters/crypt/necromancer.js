import removeStatusEffect from '../../actions/removeStatusEffectAction.js'

export default {
  baseStats: {
    hpMax: '-30%',
    speed: '-15%',
    magicPower: '+20%'
  },
  items: [
    {
      name: 'Spell Caster',
      description: 'Deals magic damage.',
      mods: ['magicAttack']
    },{
      name: 'Cleanse',
      abilities: {
        active: {
          conditions: {
            debuffed: true
          },
          cooldown: 10000,
          actions: [removeStatusEffect({
            affects: 'self',
            isBuff: false
          })]
        }
      }
    }
  ]
}