import maybeAction from '../../actions/maybeAction.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    hpMax: '+20%',
    physPower: '-10%',
    speed: -10
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
              chance: 0.1
            }),
            attackAction({
              targetMaxHpPct: 1,
              damageType: 'magic',
              damageMulti: 0
            })
          ]
        }
      }
    }
  ]
}