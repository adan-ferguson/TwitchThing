import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'dying',
        uses: level,
        replacements: {
          cancel: 'Rebirth'
        },
        actions: [barrierAction({
          hpMax: 1
        },{
          persisting: true,
          stats: {
            physPower: (level + 3) / 2 + 'x',
            magicPower: (level + 3) / 2 + 'x'
          }
        })]
      }],
    },
    orbs: level * 15
  }
}