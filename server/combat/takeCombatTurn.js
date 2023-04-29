import { performAction, useEffectAbility } from '../actions/performAction.js'

export function takeCombatTurn(combat, actor){
  if(!actor.inCombat){
    throw 'Actor is not in combat'
  }
  if(!actor.actionReady){
    return []
  }
  const effect = actor.getNextActiveEffect()
  const actions = []
  if(effect){
    actions.push(useEffectAbility(combat, effect, 'active'))
  }else if(actor.mods.contains('noBasicAttack')){
    actions.push(performAction(combat, actor, null, {
      type: 'idle',
      reason: 'Can\'t attack'
    }))
  }else{
    for(let i = 0; i < actor.stats.get('attacks').value; i++){
      actions.push(performAction(combat, actor, null, basicAttackDef(actor)))
    }
  }
  actor.nextTurn()
  return actions
}

function basicAttackDef(actor){
  return {
    basic: true,
    damageType: actor.basicAttackType,
    scaling: {
      [actor.basicAttackType + 'Power']: 1
    }
  }
}