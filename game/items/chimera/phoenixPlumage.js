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
            physPower: '2x',
            magicPower: '2x'
          }
        })]
      }],
    },
    orbs: level * 10 + 5
  }
}