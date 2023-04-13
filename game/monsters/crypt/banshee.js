import attackAction from '../../actions/actionDefs/common/attack.js'

export default {
  baseStats: {
    physPower: '-70%',
    magicPower: '+30%',
    hpMax: '-50%'
  },
  items: [
    {
      name: 'Wail',
      abilities: {
        active: {
          description: 'Deal 50% of enemy\'s remaining health as magic damage.',
          uses: 1,
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 0,
              targetHpPct: 0.5
            })
          ]
        }
      }
    },
    {
      name: 'Incorporeal',
      stats: {
        dodgeChance: '33%'
      }
    }
  ]
}