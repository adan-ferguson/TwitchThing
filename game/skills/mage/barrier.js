import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(level){
  const magicPower = 0.8 + level * 0.6
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