import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(level){
  const magicPower = 1.3 + level * 0.7
  const cooldown = 12000 + level * 3000
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