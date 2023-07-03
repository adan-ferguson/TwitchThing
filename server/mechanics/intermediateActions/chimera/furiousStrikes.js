import { simpleAttackAction } from '../../../../game/commonTemplates/simpleAttackAction.js'

export default function(combat, actor, abilityInstance, { base, per, damagePer }){
  const hits = base + Math.floor(actor.stats.get('speed').value / per)
  return simpleAttackAction('phys', damagePer, hits)
}