import { scaledNumberFromFighterInstance } from '../../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf?.(actor)
  const damage = scaledNumberFromFighterInstance(target, actionDef.scaling)
  if(target){
    return [{
      attack: {
        ...actionDef,
        scaling: {
          flat: damage
        }
      }
    }]
  }
}