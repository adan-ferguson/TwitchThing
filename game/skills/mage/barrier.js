import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(level){
  const magicPower = 0.7 + level * 0.4
  const cooldown = 16000 + level * 4000
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown,
        actions: [barrierAction({
          magicPower
        },{
          persisting: true
        })]
      }]
    }
  }
}