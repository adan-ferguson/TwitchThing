const DEFAULTS = {
  name: '',
  username: '',
  experience: 0,
  items: [1,0,0,0,0,0,0,0],
  date: new Date(0)
}

export default class Character {

  constructor(data){
    this.data = Object.assign({}, DEFAULTS, data)
    delete this.data.level
  }

  get name(){
    return this.data.name
  }

  get level(){
    return 1 // todo: exp func
  }

  get items(){
    return this.data.items.toString()
  }

  get experience(){
    return this.data.experience
  }

  toDocument(){
    return Object.assign({
      level: this.level
    }, this.data)
  }
}

export function initDocument(data){
  return (new Character(data)).toDocument()
}