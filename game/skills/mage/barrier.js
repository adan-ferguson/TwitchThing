import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(level){
  const magicPower = 0.8 + level * 0.5
  const cooldown = 16000 + level * 4000
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
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