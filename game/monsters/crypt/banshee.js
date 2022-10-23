import { magicAttackMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    physPower: '-80%',
    magicPower: '-30%',
    hpMax: '-40%'
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
      mods: [magicAttackMod],
      description: 'Physical attacks have 1/3 chance to miss this.',
      abilities: {
        physAttacked: {
          chance: 1/3,
          actions: [
            {
              type: 'cancel',
              reason: 'missed'
            }
          ]
        }
      }
    }
  ]
}