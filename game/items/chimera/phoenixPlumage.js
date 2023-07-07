import { barrierAction } from '../../commonTemplates/barrierAction.js'

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
            magicPower: '2x'
          }
        })]
      }],
    },
    orbs: level * 10 + 5
  }
}