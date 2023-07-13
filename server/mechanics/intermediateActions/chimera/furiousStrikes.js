import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'

export default function(combat, actor, abilityInstance, { base, per, damagePer }){
  const hits = base + Math.max(0, Math.floor(actor.stats.get('speed').value / per))
  return simpleAttackAction('phys', damagePer, hits)
}