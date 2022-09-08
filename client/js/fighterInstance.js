import AdventurerInstance from '../../game/adventurerInstance.js'
import { monsterDisplayName } from './monsterDisplayInfo.js'

export function fighterInstanceDisplayName(fighterInstance){
  if(fighterInstance instanceof AdventurerInstance){
    return fighterInstance.fighterData.name
  }else {
    return monsterDisplayName(fighterInstance)
  }
}