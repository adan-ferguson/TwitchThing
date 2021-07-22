export default class Character {

  constructor(data){
    this.data = data
    delete this.data.level
  }

  get name(){
    return this.data.name
  }

  get level(){
    return 1 // todo: exp func
  }

  get items(){
    return this.data.items
  }

  get experience(){
    return this.data.experience
  }
}