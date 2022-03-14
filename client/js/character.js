import Item from '/game/item.js'
import Stats from '/game/stats/stats.js'

export default class Character{

  constructor(data){
    this.data = data
    this.items = this.data.items.map(item => item ? new Item(item) : null)
  }

  get name(){
    return this.data.name
  }

  get level(){
    return 1 // todo: exp func
  }

  get experience(){
    return this.data.experience
  }

  get stats(){
    return new Stats(this)
  }

  get filteredItems(){
    return this.items.filter(i => i)
  }

  get innateBonuses(){
    return this.data.innateBonuses || []
  }
}