import { all as Mods } from '../../game/mods/combined.js'
import { gainHealth } from './common.js'

export function performCombatAction(combat, actor){
  actor.timeSinceLastAction = 0
  return {
    ability: 'basicAttack',
    results: basicAttack(combat).filter(r => r)
  }
}

function basicAttack(combat, actor){

  const enemy = combat.getEnemyOf(actor)
  const dodged = attemptDodge(enemy)

  if(dodged){
    return [{
      subject: enemy.fighterId,
      resultType: 'dodge'
    }]
  }

  const magicAttack = actor.mods.contains(Mods.magicAttack)
  const damageInfo = {
    resultType: 'damage',
    subject: enemy.fighterId,
    damageType: magicAttack ? 'magic' : 'phys',
    baseDamage: Math.ceil(actor.basePower * actor.stats.get(magicAttack ? 'magicPower' : 'physPower').value)
  }

  if(attemptCrit(actor)){
    damageInfo.baseDamage *= (1 + actor.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  const damageResult = takeDamage(enemy, damageInfo)
  return [damageResult, lifesteal(actor, damageResult)]
}

function attemptCrit(actor){
  return Math.random() + actor.stats.get('critChance').value > 1
}

function attemptDodge(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function takeDamage(subject, damageInfo){
  const blocked = Math.floor(damageInfo.baseDamage * subject.stats.get(damageInfo.damageType + 'Def').value)
  const finalDamage = Math.min(subject.hp, damageInfo.baseDamage - blocked)
  subject.hp -= finalDamage
  return { ...damageInfo, blocked, finalDamage }
}

function lifesteal(actor, damageResult){
  const lifesteal = Math.min(
    actor.hpMax - actor.hp,
    Math.ceil(actor.stats.get('lifesteal').value * damageResult.finalDamage)
  )
  if(lifesteal){
    return gainHealth(actor, lifesteal)
  }
}