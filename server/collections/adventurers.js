import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  type: 'adventurer',
  name: null,
  level: 1,
  xp: 0,
  userID: null,
  loadout: {
    items: [null, null, null, null, null, null, null, null],
    skills: [null, null, null, null, null, null, null, null]
  },
  orbs: {},
  unlockedSkills: {},
  dungeonRunID: null,
  accomplishments: {
    deepestFloor: 1
  }
}

class AdventurersCollection extends Collection{
  constructor(){
    super('adventurers', DEFAULTS)
  }
  async createNew(userID, name, startingClass = null){
    const doc = { name, userID }
    if(startingClass){
      doc.orbs[startingClass] = 1
    }
    return await this.save(doc)
  }
}

export default new AdventurersCollection()