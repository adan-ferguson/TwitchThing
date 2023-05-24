import { processAbilityEvents } from '../../abilities.js'
import { dealDamage } from '../../dealDamage.js'
import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'
import { ignoresDefenseMatchesDamageType } from '../../../../game/mechanicsFns.js'

export default function(combat, attacker, abilityInstance = null, actionDef = {}){

  const results = []
  for(let i = 0; i < actionDef.hits; i++){
    results.push(hit())
  }
  return results

  function hit(){
    
    const enemy = combat.getEnemyOf(attacker)
    const ret = { subject: enemy.uniqueID }

    actionDef = processAbilityEvents(combat, ['attack'], attacker, abilityInstance, actionDef)
    actionDef = processAbilityEvents(combat, ['attacked', actionDef.damageType + 'Attacked'], enemy, abilityInstance, actionDef)

    if(!actionDef.undodgeable && (actionDef.forceDodge || dodgeAttack(enemy))){
      return {
        ...ret,
        cancelled: 'dodge'
      }
    }

    if (missAttack(attacker)){
      // processAbilityEvents('miss', attacker)
      // return {
      //   ...ret,
      //   cancelled: 'miss'
      // }
    }

    if (!abilityInstance){
      abilityInstance = fakeBasicAttackAbilityInstance(attacker)
    }

    let damage = scaledNumberFromAbilityInstance(abilityInstance, actionDef.scaling)
    let damageInfo = {
      damageType: actionDef.damageType,
      damage: damage, // * attacker.stats.get('damageDealt').value,
      range: actionDef.range
    }

    const mods = (abilityInstance?.parentEffect ?? attacker).modsOfType('ignoreDef')
    damageInfo.ignoreDefense = ignoresDefenseMatchesDamageType(mods, actionDef.damageType)

    if(attemptCrit(attacker, enemy)){
      damageInfo.damage *= (1 + attacker.stats.get('critDamage').value)
      damageInfo.crit = true
    }

    damageInfo = dealDamage(combat, attacker, enemy, damageInfo)
    damageInfo = processAbilityEvents(combat, ['attackHit', damageInfo.damageType + 'AttackHit'], attacker, abilityInstance, damageInfo)
    damageInfo = processAbilityEvents(combat, 'hitByAttack', enemy, abilityInstance, damageInfo)

    // if(damageInfo.crit){
    //   damageInfo = processAbilityEvents(combat, 'crit', attacker, damageInfo)
    // }

    ret.damageInfo = damageInfo

    return ret
  }
}

function attemptCrit(actor, target, bonusCritChance){
  if(target.hasMod('autoCritAgainst')){
    return true
  }
  return Math.random() +
    target.stats.get('enemyCritChance').value +
    actor.stats.get('critChance').value +
    bonusCritChance > 1
}

function dodgeAttack(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function missAttack(actor){
  return Math.random() + actor.stats.get('missChance').value > 1
}

function fakeBasicAttackAbilityInstance(attacker){
  return {
    totalStats: attacker.stats,
    fighterInstance: attacker
  }
}