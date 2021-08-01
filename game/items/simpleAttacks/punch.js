import { ItemDefinition } from '../../item.js'

export class Punch extends ItemDefinition {

  get id(){
    return 'punch'
  }

  get name(){
    return 'Punch'
  }

  get level(){
    return 1
  }

}