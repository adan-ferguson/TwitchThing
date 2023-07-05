import { processAbilityEvents } from '../../abilities.js'
import { dealDamage } from '../../dealDamage.js'
import { scaledNumberFromAbilityInstance, scaledNumberFromFighterInstance } from '../../../../game/scaledNumber.js'
import { ignoresDefenseMatchesDamageType } from '../../../../game/mechanicsFns.js'
import { deepClone } from '../../../../game/utilFunctions.js'

export default function(combat, attacker, enemy, abilityInstance = null, actionDef = {}){

  if(attacker === enemy){
    throw 'Attacking self? Probably error.'
  }

  const results = []
  for(let i = 0; i < actionDef.hits; i++){
    if(attacker.hasMod('noAttack')){
      continue
    }
    if(enemy.dead){
      continue
    }
    results.push(hit(deepClone(actionDef)))
  }
  return results

  function hit(actionDef){

    actionDef = processAbilityEvents(combat, ['attack'], attacker, abilityInstance, actionDef)
    actionDef = processAbilityEvents(combat, ['attacked', actionDef.damageType + 'Attacked'], enemy, abilityInstance, actionDef)

    if(actionDef.cancelled){
      return {
        cancelled: actionDef.cancelled
      }
    }

    if(!abilityInstance){
      abilityInstance = fakeBasicAttackAbilityInstance(attacker)
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
    damage += scaledNumberFromFighterInstance(enemy, actionDef.targetScaling)
    let damageInfo = {
      isAttack: true,
      damageType: actionDef.damageType,
      damage: damage,
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
  if(actionDef.forceDodge){
    return true
  }
  return Math.random() + target.stats.get('dodgeChance').value > 1
}

function tryMiss(actionDef, abilityInstance){
  if(actionDef.forceMiss){
    return true
  }
  return Math.random() + abilityInstance.totalStats.get('missChance').value > 1
}

function tryCrit(actionDef, abilityInstance, target){
  if(actionDef.damageType !== 'phys' && !abilityInstance.fighterInstance.hasMod('magicCrit')){
    return false
  }
  const chance = target.stats.get('enemyCritChance').value + abilityInstance.totalStats.get('critChance').value
  return Math.random() + chance > 1
}

function fakeBasicAttackAbilityInstance(attacker){
  return {
    totalStats: attacker.stats,
    fighterInstance: attacker
  }
}