import { attachedItem } from './components/common.js'
import OrbRow from './components/orbRow.js'

export function skillDisplayInfo(adventurerSkill){
  return {
    extraDetails: null
  }
}

const skillDefs = {
  fighter02: {
    extraDetails: skill => {
      return `${attachedItem()} costs ${orb({ fighter: skill. })} less.`
    }
  }
}


function orb(orbData){
  return new OrbRow().setData(orbData)
}