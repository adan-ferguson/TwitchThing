import { terribleCurses } from '../../../../game/commonTemplates/terribleCurses.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  if(!target.hasStatusEffect({ tag: 'terribleCurse' })){
    return terribleCurses()
  }
  return null
}