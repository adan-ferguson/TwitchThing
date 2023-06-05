import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(level){
  const magicPower = 1.3 + level * 0.7
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [barrierAction({
          magicPower
        },{
          persisting: true
        })]
      }]
    }
  }
}