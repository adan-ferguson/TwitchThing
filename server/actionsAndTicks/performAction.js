export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  actor.resetTimeSinceLastAction()
  const index = actor.nextActiveItemIndex()
  if(index > -1){
    return useItemAbility(combat, actor, index)
  }
  return {
    ability: 'basicAttack',
    actor: actor.uniqueID,
    results: attack(combat, actor).filter(r => r)
  }
}

function useItemAbility(combat, actor, index){
  const itemInstance = actor.itemInstances[index]
  const ability = itemInstance?.ability
  if(!ability){
    throw 'Can not use item ability so I\'m not sure what\'s going on here'
  }

  const results = []
  for(let i = 0; i < ability.actions.length; i++){
    const actionResults = doAction(combat, actor, ability.actions[i])
    results.push(...actionResults)
    if(actionResults.at(-1).failed){
      // TODO: not necessarily the correct thing to do
      break
    }
  }

  itemInstance.enterCooldown()

  return {
    ability: index,
    actor: actor.uniqueID,
    results: results.filter(r => r)
  }
}

/**
 * @param combat
 * @param actor
 * @param actionDef
 * @returns {array}
 */
function doAction(combat, actor, actionDef){
  if(actionDef.type === 'attack'){
    return attack(combat, actor, actionDef)
  }else if(actionDef.type === 'effect'){
    const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
    subject.gainEffect(actionDef.effect)
    return [{
      resultType: 'gainEffect',
      effect: actionDef.effect,
      subject: subject.uniqueID
    }]
  }else if(actionDef.type === 'time'){
    actor.adjustNextActionTime(actionDef.ms)
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

  let baseDamage = actor[actionDef.damageType + 'Power']
  baseDamage *= actionDef.damageMulti

  const damageInfo = {
    resultType: 'damage',
    subject: enemy.uniqueID,
    damageType: actionDef.damageType,
    baseDamage
  }

  if(attemptCrit(actor)){
    baseDamage *= (1 + actor.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  const damageResult = takeDamage(enemy, damageInfo)
  results.push(damageResult)

  // TODO: triggers for "onDealDamage"
  // , lifesteal(actor, damageResult)

  return results
}

function attemptCrit(actor){
  return Math.random() + actor.stats.get('critChance').value > 1
}

function attemptDodge(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function takeDamage(subject, damageInfo){
  const blocked = Math.floor(damageInfo.baseDamage * subject.stats.get(damageInfo.damageType + 'Def').value)
  const finalDamage = Math.ceil(Math.min(subject.hp, damageInfo.baseDamage - blocked))
  subject.hp -= finalDamage
  // TODO: triggers for "onTakeDamage"
  return { ...damageInfo, blocked, finalDamage }
}

function triggerBeforeAttacked(combat, owner){
  // TODO: this seems prone to infinite loops
  const abilities = owner.triggeredAbilities('beforeAttacked')
  const results = []
  abilities.forEach(abilityIndex => {
    results.push(useItemAbility(combat, owner, abilityIndex))
  })
  // TODO: triggered visualEffects
  return results
}

// function lifesteal(actor, damageResult){
//   const lifesteal = Math.min(
//     actor.hpMax - actor.hp,
//     Math.ceil(actor.stats.get('lifesteal').value * damageResult.finalDamage)
//   )
//   if(lifesteal){
//     return gainHealth(actor, lifesteal)
//   }
// }