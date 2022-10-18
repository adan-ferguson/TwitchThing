import removeThisStatusEffectAction from '../../actions/removeThisStatusEffectAction.js'
import { hungryMod } from '../../mods/combined.js'

export default {
  mods: [hungryMod],
  combatOnly: false,
  description: 'Reduced stats, desperately needs to eat.',
  stats: {
    physPower: '-20%',
    magicPower: '-20%',
    damageTaken: '+20%'
  },
  abilities: {
    rest: {
      actions: [
        removeThisStatusEffectAction()
      ]
    }
  }
}