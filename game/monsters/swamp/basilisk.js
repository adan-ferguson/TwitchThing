import maybeAction from '../../actions/maybeAction.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    hpMax: '-10%',
    speed: '+5%'
  },
  items: [
    {
      name: 'Deadly Gaze',
      abilities: {
        active: {
          description: '10% chance to deal magic damage equal to enemy\'s max health',
          cooldown: 7500,
          actions: [
            maybeAction({
              chance: 0.1,
              action:
                attackAction({
                  targetMaxHpPct: 1
                })
            })
          ]
        }
      }
    }
  ]
}