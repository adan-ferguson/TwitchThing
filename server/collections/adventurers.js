import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  name: null,
  level: 1,
  xp: 0,
  userID: null,
  loadout: [null, null, null, null, null, null, null, null],
  dungeonRunID: null,
  baseStats: {
    hpMax: 100,
    attack: 10
  },
  levelups: []
}

const Adventurers = new Collection('adventurers', DEFAULTS)

Adventurers.createNew = async function(userID, name){
  return await Adventurers.save({ name, userID })
}

export default Adventurers