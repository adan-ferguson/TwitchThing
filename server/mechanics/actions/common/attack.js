import { processAbilityEvents } from '../../abilities.js'
import { dealDamage } from '../../dealDamage.js'
import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'
import { ignoresDefenseMatchesDamageType } from '../../../../game/mechanicsFns.js'
import { deepClone } from '../../../../game/utilFunctions.js'

export default function(combat, attacker, enemy, abilityInstance = null, actionDef = {}){

  if(
    attacker.hasMod('noAttack') ||
    actionDef.basic && attacker.hasMod('noBasicAttack')
  ){
    return {
      subject: attacker.uniqueID,
      cancelled: { reason: 'noAttack', reasonMsg: 'Can\'t attack' }
    }
  }

  const results = []
  for(let i = 0; i < actionDef.hits; i++){
    if(enemy.dead){
      continue
    }
    results.push(hit(deepClone(actionDef)))
  }
  return results

  function hit(actionDef){

    actionDef = processAbilityEvents(combat, ['attack'], attacker, abilityInstance, actionDef)
    actionDef = processAbilityEvents(combat, ['attacked', actionDef.damageType + 'Attacked'], enemy, abilityInstance, actionDef)

    if(!abilityInstance){
      abilityInstance = fakeBasicAttackAbilityInstance(attacker)
    }

    if(actionDef.cancelled){
      return {
        cancelled: actionDef.cancelled
      }
    }

    if(!actionDef.cantDodge && tryDodge(actionDef, abilityInstance, enemy)){
      return {
        cancelled: {
          reason: 'dodge'
        }
      }
    }

    if(!actionDef.cantMiss && tryMiss(actionDef, abilityInstance)){
      return {
        cancelled: {
          reason: 'miss'
        }
      }
    }

    let damage = scaledNumberFromAbilityInstance(abilityInstance, actionDef.scaling)
    let damageInfo = {
      isAttack: true,
      damageType: actionDef.damageType,
      damage: damage * abilityInstance.totalStats.get('damageDealt').value,
      range: actionDef.range,
      lifesteal: actionDef.lifesteal
    }

    const mods = (abilityInstance?.parentEffect ?? attacker).modsOfType('ignoreDef')
    damageInfo.ignoreDefense = ignoresDefenseMatchesDamageType(mods, actionDef.damageType)

    if(tryCrit(actionDef, abilityInstance, enemy)){
      damageInfo.damage *= (1 + abilityInstance.totalStats.get('critDamage').value)
      damageInfo.crit = true
      processAbilityEvents(combat, 'crit', attacker, abilityInstance)
    }

    const debuffCount = enemy.statusEffectInstances.filter(sei => sei.polarity === 'debuff').length
    damageInfo.damage *= (1 + debuffCount * attacker.stats.get('damagePerEnemyDebuff').value)

    let damageResult = dealDamage(combat, attacker, enemy, damageInfo)
    damageResult = processAbilityEvents(combat, ['attackHit', damageInfo.damageType + 'AttackHit'], attacker, abilityInstance, damageResult)
    damageResult = processAbilityEvents(combat, 'hitByAttack', enemy, abilityInstance, damageResult)

    if(enemy.dead){
      processAbilityEvents(combat, 'kill', attacker, abilityInstance, {
        killed: enemy.uniqueID
      })
    }

    return { damageInfo: damageResult }
  }
}

function tryDodge(actionDef, abilityInstance, target){
  return Math.random() + target.stats.get('dodgeChance').value > 1
}

function tryMiss(actionDef, abilityInstance){
  return Math.random() + abilityInstance.totalStats.get('missChance').value > 1
}

function tryCrit(actionDef, abilityInstance, target){
  const chance = target.stats.get('enemyCritChance').value + abilityInstance.totalStats.get('critChance').value
  return Math.random() + chance > 1
}

function fakeBasicAttackAbilityInstance(attacker){
  return {
    totalStats: attacker.stats,
    fighterInstance: attacker
  }
}