import { regenerationEffect } from '../../commonMechanics/effects/regenerationEffect.js'

export default function(level){
  const initialCooldown = Math.ceil(10000 * Math.pow(0.9, level - 1))
  const hpMissing = 0.08 + level * 0.02
  return {
    effect: regenerationEffect(hpMissing, initialCooldown),
    displayName: 'Regenerative Cells',
    orbs: 3 + level * 3
  }
}