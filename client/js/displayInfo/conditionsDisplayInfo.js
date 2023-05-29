import { roundToFixed } from '../../../game/utilFunctions.js'

export function conditionsDisplayInfo(conditions){
  if(conditions.deepestFloor){
    return 'While on this adventurer\'s<br/>deepest explored floor:'
  }else if(conditions.bossFight){
    return 'During boss fights:'
  }else if(conditions.hpPctBelow){
    return `While hp percentage is below ${roundToFixed(conditions.hpPctBelow * 100, 2)}%:`
  }
  return null
}