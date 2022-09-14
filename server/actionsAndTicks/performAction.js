import { all as Mods } from '../../game/mods/combined.js'

export function performCombatAction(combat, actor){
  actor.resetTimeSinceLastAction()
  const index = actor.nextActiveItemIndex()
  if(index > -1){
    return useItemAbility(combat, actor, index)
  }
  return {
    ability: 'basicAttack',
    results: attack(combat, actor).filter(r => r)
  }
}

function useItemAbility(combat, actor, index){
  const itemInstance = actor.itemInstances[index]
  if(!itemInstance?.activeAbility){
    throw 'Can not use item ability so I\'m not sure what\'s going on here'
  }

  const results = []
  itemInstance.activeAbility.actions.forEach(actionDef => {
    results.push(...doAction(combat, actor, actionDef))
  })

  itemInstance.enterCooldown()
  return {
    ability: index,
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
  }
  return []
}

function attack(combat, actor, actionDef = {}){

  actionDef = {
    damageMulti: 1,
    damageType: 'auto',
    ...actionDef
  }

  const enemy = combat.getEnemyOf(actor)
  const dodged = attemptDodge(enemy)

  if(dodged){
    return [{
      subject: enemy.uniqueID,
      resultType: 'dodge'
    }]
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

  // TODO: triggers for "onDealDamage"
  // , lifesteal(actor, damageResult)

  return [damageResult]
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

// function lifesteal(actor, damageResult){
//   const lifesteal = Math.min(
//     actor.hpMax - actor.hp,
//     Math.ceil(actor.stats.get('lifesteal').value * damageResult.finalDamage)
//   )
//   if(lifesteal){
//     return gainHealth(actor, lifesteal)
//   }
// }