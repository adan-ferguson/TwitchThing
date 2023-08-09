import Collection from './collection.js'

const DEFAULTS = {
  dungeonRunID: null,
  data: {}, // extra non-required data
  _id: null,
}

const FullEvents = new Collection('fullEvents', DEFAULTS)

FullEvents.findByDungeonRunID = async function(dungeonRunID){
  return await FullEvents.find({
    query: {
      dungeonRunID
    },
    sort: {
      'data.time': 1
    }
  })
}

export default FullEvents