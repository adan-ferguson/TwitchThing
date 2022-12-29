import turnTimeAction from '../../actions/turnTimeAction.js'
import { dodgeChanceStat } from '../../stats/combined.js'

export default {
  effect: {
    stats: {
      [dodgeChanceStat.name]: '10%'
    },
    abilities: {
      dodge: {
        description: 'Whenever you dodge something, refresh your action bar.',
        actions: [turnTimeAction({
          setRemaining: 100
        })]
      }
    }
  },
  minOrbs: 30,
  rarity: 2
}