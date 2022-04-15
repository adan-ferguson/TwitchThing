export default class DungeonRunResults{
  constructor(dungeonRun){
    this.dungeonRun = dungeonRun
    this.lastEvent = new Ending(dungeonRun.events.at(-1))
    this.monstersKilled = new MonstersKilled(dungeonRun.events)
    this.relicsFound = new RelicsFound(dungeonRun.events)
    this.chests =
  }
}

class Ending{
  constructor(lastEvent){
    this.monster = lastEvent.monster
  }
}

class MonstersKilled{
  constructor(events){
    this.monsters = []
    events.forEach(event => {
      if(event.monster?.defeated){
        this.monsters.push(event.monster)
      }
    })
  }

  get count(){
    return this.monsters.length
  }
}

class RelicsFound{
  constructor(events){
    this.relics = []
    events.forEach(event => {
      if(event.relic){
        this.relics.push(event.monster)
      }
    })
  }

  get count(){
    return this.relics.length
  }
}