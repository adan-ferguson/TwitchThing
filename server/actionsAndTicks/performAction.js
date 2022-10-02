import { gainHealth } from './common.js'
import { applyStatusEffect } from './applyStatusEffect.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  actor.resetTimeSinceLastAction()
  const index = actor.nextActiveItemIndex()
  if(index > -1){
    return useEffectAbility(combat, actor.itemInstances[index])
  }
  return {
    ability: 'basicAttack',
    owner: actor.uniqueID,
    results: attack(combat, actor).filter(r => r)
  }
}

export function useEffectAbility(combat, effect){
  const ability = effect?.ability
  if(!ability){
    throw 'Can not use item ability so I\'m not sure what\'s going on here'
  }
  if(!effect.owner){
    throw 'Effect has no owner, so hard for its ability to get triggered'
  }
  const results = []
  for(let i = 0; i < ability.actions.length; i++){
    const actionResults = doAction(combat, effect.owner, ability.actions[i])
    results.push(...actionResults)
    if(actionResults.at(-1)?.failed){
      // TODO: not necessarily the correct thing to do
      break
    }
  }

  effect.used()

  return {
    ability: effect.id,
    owner: effect.owner.uniqueID,
    results: results.filter(r => r)
  }
}

/**
 * @param combat
 * @param owner
 * @param actionDef
 * @returns {array}
 */
function doAction(combat, owner, actionDef){
  if(actionDef.type === 'attack'){
    return attack(combat, owner, actionDef)
  }else if(actionDef.type === 'statusEffect'){
    const subject = actionDef.affects === 'self' ? owner : combat.getEnemyOf(owner)
    return [{
      resultType: 'gainEffect',
      effect: applyStatusEffect(combat, owner, subject, actionDef.effect),
      subject: subject.uniqueID
    }]
  }else if(actionDef.type === 'time'){
    owner.adjustNextActionTime(actionDef.ms)
  }else if(actionDef.type === 'takeDamage'){
    return [takeDamage(owner, actionDef)]
  }
  return []
}

function attack(combat, actor, actionDef = {}){

  actionDef = {
    damageMulti: 1,
    damageType: 'auto',
    ...actionDef
  }

  const results = []
  const enemy = combat.getEnemyOf(actor)
  results.push(...triggerBeforeAttacked(combat, enemy))
  const dodged = attemptDodge(enemy)

  if(dodged){
    results.push({
      subject: enemy.uniqueID,
      resultType: 'dodge',
      failed: true
    })
    return results
  }

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = actor.basicAttackType
  }

  let damage = actor[actionDef.damageType + 'Power']
  damage *= actionDef.damageMulti

  const damageInfo = {
    resultType: 'damage',
    subject: enemy.uniqueID,
    damageType: actionDef.damageType,
    damage
  }

  if(attemptCrit(actor)){
    damage *= (1 + actor.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  results.push(...dealDamage(actor, enemy, damageInfo))
  results.push(...triggerAttackHit(combat, actor, enemy))

  return results
}

function attemptCrit(actor){
  return Math.random() + actor.stats.get('critChance').value > 1
}

function attemptDodge(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function dealDamage(actor, enemy, damageInfo){

  const results = []
  const damageResult = takeDamage(enemy, damageInfo)
  results.push(damageResult)

  const lifesteal = Math.min(
    actor.hpMax - actor.hp,
    Math.ceil(actor.stats.get('lifesteal').value * damageResult.finalDamage)
  )

  if(lifesteal){
    results.push(gainHealth(actor, lifesteal))
  }

  return results
}

function takeDamage(subject, damageInfo){

  damageInfo = {
    damage: null,
    damageType: 'phys',
    useDecimals: false,
    ...damageInfo
  }

  const blocked = Math.floor(damageInfo.damage * subject.stats.get(damageInfo.damageType + 'Def').value)
  let finalDamage = Math.min(subject.hp, damageInfo.damage - blocked)
  if(damageInfo.useDecimals){
    finalDamage = Math.ceil(finalDamage)
  }
  subject.changeHpWithDecimals(-finalDamage)
  // TODO: triggers for "onTakeDamage"
  return { ...damageInfo, blocked, finalDamage }
}

function triggerBeforeAttacked(combat, owner){

  // TODO: this seems prone to infinite loops
  const effects = owner.triggeredEffects('beforeAttacked')
  const results = []
  effects.forEach(effect => {
    results.push(useEffectAbility(combat, effect))
  })
  return results
}

function triggerAttackHit(combat, actor){
  const effects = actor.triggeredEffects('attackHit')
  const results = []
  effects.forEach(effect => {
    results.push(useEffectAbility(combat, effect))
  })
  return results
}