import Collection from './collection.js'

const DEFAULTS = {
  dungeonRunID: null,
  data: {}, // extra non-required data
  _id: null,
}

const EVENTS_LIMIT = 250

const FullEvents = new Collection('fullEvents', DEFAULTS)

FullEvents.findByDungeonRunID = async function(dungeonRunID){
  const cursor = FullEvents.collection.find({ dungeonRunID }).sort({ 'data.time': -1 }).limit(EVENTS_LIMIT)
  const arr = []
  for await(let doc of cursor){
    arr.push(doc)
  }
  return arr.reverse()
}

FullEvents.lastEventOf = async function(dungeonRunID){
  return await FullEvents.find({
    query: {
      dungeonRunID
    },
    sort: {
      'data.time': -1
    },
    limit: 1
  })
}

export default FullEvents