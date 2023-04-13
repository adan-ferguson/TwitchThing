import { noBasicAttackMod } from '../../game/mods/combined.js'
import attackAction from '../../game/actions/actionDefs/common/attack.js'
import { performAction } from '../actions/performAction.js'

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
  }else if(actor.mods.contains(noBasicAttackMod)){
    actions.push({
      basicAttack: true,
      owner: actor.uniqueID,
      results: [performCancelAction(actor, {
        cancelReason: 'Can\'t attack'
      })]
    })
  }else{
    for(let i = 0; i < actor.stats.get('attacks').value; i++){
      actions.push(performAction(combat, actor, null, {
        type: 'attack',
        basic: true
      }))
    }
  }
  actor.nextTurn()
  return actions
}