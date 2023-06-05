import { roundToFixed } from '../../../game/utilFunctions.js'

export function conditionsDisplayInfo(conditions){
  if(conditions.owner.deepestFloor){
    return 'While on this adventurer\'s<br/>deepest explored floor:'
  }else if(conditions.owner.bossFight){
    return 'During boss fights:'
  }else if(conditions.owner.hpPctBelow){
    return `While hp percentage is below ${roundToFixed(conditions.owner.hpPctBelow * 100, 2)}%:`
  }
  return null
}