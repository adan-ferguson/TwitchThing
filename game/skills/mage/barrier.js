import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(level){
  const magicPower = 0.6 + level * 0.5
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