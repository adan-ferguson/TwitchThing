import Collection from './collection.js'
import { firstLevelBonus } from '../adventurer/bonuses.js'

const DEFAULTS = {
  _id: null,
  type: 'adventurer',
  name: null,
  level: 1,
  xp: 0,
  userID: null,
  items: [null, null, null, null, null, null, null, null],
  dungeonRunID: null,
  bonuses: {},
  accomplishments: {
    deepestFloor: 1
  },
  nextLevelUp: null
}

const Adventurers = new Collection('adventurers', DEFAULTS)

Adventurers.createNew = async function(userID, name, startingClass){
  return await Adventurers.save(
    {
      name, userID, bonuses: {
        [startingClass]: {
          [firstLevelBonus(startingClass)]: 1
        }
      }
    })
}

export default Adventurers