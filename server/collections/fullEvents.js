import Collection from './collection.js'
import ConsoleTimer from '../../game/consoleTimer.js'

const DEFAULTS = {
  dungeonRunID: null,
  data: {}, // extra non-required data
  _id: null,
}

const FullEvents = new Collection('fullEvents', DEFAULTS)

FullEvents.findByDungeonRunID = async function(dungeonRunID, limit = 1000){
  const timer = new ConsoleTimer()
  timer.log('loading ' + dungeonRunID)
  let cursor = FullEvents.collection.find({ dungeonRunID }).sort({ 'data.time': -1 }).limit(limit)
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