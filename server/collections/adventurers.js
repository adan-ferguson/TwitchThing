import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  name: null,
  level: 1,
  xp: 0,
  userID: null,
  items: [null, null, null, null, null, null, null, null],
  dungeonRunID: null,
  bonuses: [],
  accomplishments: {
    highestFloor: 1
  }
}

const Adventurers = new Collection('adventurers', DEFAULTS)

Adventurers.createNew = async function(userID, name){
  return await Adventurers.save({ name, userID })
}

export default Adventurers