import { roundToFixed } from '../../../game/utilFunctions.js'
import { keyword } from './keywordDisplayInfo.js'

export function conditionsDisplayInfo(conditions){
  if(conditions.owner.deepestFloor){
    return 'While on this adventurer\'s<br/>deepest explored floor:'
  }else if(conditions.owner.bossFight){
    return 'During boss fights:'
  }else if(conditions.owner.hpPctBelow){
    return `While health is below ${roundToFixed(conditions.owner.hpPctBelow * 100, 2)}%:`
  }else if(conditions.owner.overtime){
    return `While in ${keyword('overtime')}:`
  }else if(conditions.owner.hpFull){
    return 'While health is full:'
  }
  return null
}