export default class DungeonRunResults{
  constructor(dungeonRun){
    this.dungeonRun = dungeonRun
    this.lastEvent = new Ending(dungeonRun.events.at(-1))
    this.monstersKilled = new MonstersKilled(dungeonRun.events)
    this.relicsFound = new RelicsFound(dungeonRun.events)
    this.chestsFound = new ChestsFound(dungeonRun.rewards.chests)
    this.chests = (dungeonRun.rewards.chests || []).slice()
  }

  get xp(){
    return this.dungeonRun.rewards.xp
  }

  getSelectedBonusForLevel(level){
    // const selectedBonus = this.dungeonRun.results.selectedBonuses.find(bonus => bonus.level === level)
  }

  getLevelUpOptions(level){

  }

  setNextLevelUp(levelUp){

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