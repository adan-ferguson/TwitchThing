export default class ItemDefinition {

  constructor(){
    if(this.id && this.name && this.level){
      this.valid = true
    }
  }

  get id(){
    throw 'Must implement id getter.'
  }

  get name(){
    throw 'Must implement name getter.'
  }

  get level(){
    throw 'Must implement level getter.'
  }
}