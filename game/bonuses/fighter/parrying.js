import turnTimeAction from '../../actions/turnTimeAction.js'

export default {
  effect: {
    stats: {
      dodgeChance: '10%'
    },
    abilities: {
      dodge: {
        description: 'Whenever you dodge something, refresh your turn timer.',
        actions: [turnTimeAction({
          setRemaining: 1
        })]
      }
    }
  },
  minOrbs: 30,
  rarity: 2
}