import { roundToFixed, wrapContent, wrapText } from '../../../game/utilFunctions.js'

export function conditionsDisplayInfo(conditions){
  if(conditions.deepestFloor){
    return wrapContent('While on this adventurer\'s<br/>deepest explored floor:')
  }else if(conditions.bossFight){
    return wrapText('During boss fights:')
  }else if(conditions.hpPctBelow){
    return wrapText(`While hp percentage is below ${roundToFixed(conditions.hpPctBelow * 100, 2)}%:`)
  }
  return null
}