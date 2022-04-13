import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  name: null,
  level: 0,
  xp: 0,
  userID: null,
  loadout: [null, null, null, null, null, null, null, null],
  dungeonRunID: null,
  baseStats: {
    hpMax: 40,
    attack: 2
  }
}

const Adventurers = new Collection('adventurers', DEFAULTS)

Adventurers.createNew = async function(userID, name){
  return await Adventurers.save({ name, userID })
}

export default Adventurers