export default class DungeonRunResults{
  constructor(dungeonRun){
    this.dungeonRun = dungeonRun
    this.lastEvent = new Ending(dungeonRun.events.at(-1))
    this.monstersKilled = new MonstersKilled(dungeonRun.events)
    this.relicsFound = new RelicsFound(dungeonRun.events)
    this.chestsFound = new ChestsFound(dungeonRun.results.rewards.chests)
    this.chests = (dungeonRun.results.rewards.chests || []).slice()
    dungeonRun.results.userLevelups.forEach(levelup => {
      if(levelup.chest){
        this.chests.push(levelup.chest)
      }
    })
  }

  getUserLevelup(level){
    return this.dungeonRun.results.userLevelups.find(levelup => levelup.level === level)
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

class ChestsFound{
  constructor(chests){
    if(!chests){
      chests = []
    }
    this.chests = chests
  }

  get count(){
    return this.chests.length
  }
}