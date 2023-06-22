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
      damageType: actionDef.damageType,
      damage: damage, // * attacker.stats.get('damageDealt').value,
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

    damageInfo = dealDamage(combat, attacker, enemy, damageInfo)
    damageInfo = processAbilityEvents(combat, ['attackHit', damageInfo.damageType + 'AttackHit'], attacker, abilityInstance, damageInfo)
    damageInfo = processAbilityEvents(combat, 'hitByAttack', enemy, abilityInstance, damageInfo)

    if(actionDef.onHit){
      combat.addPendingTriggers([{
        performAction: true,
        actor: attacker,
        ability: abilityInstance,
        def: actionDef.onHit
      }])
    }

    if(enemy.dead){
      processAbilityEvents(combat, 'kill', attacker, abilityInstance)
    }

    return { damageInfo }
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