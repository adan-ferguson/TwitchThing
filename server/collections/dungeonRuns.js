import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  adventurer: null,
  dungeonOptions: {},
  finished: false,
  finalizedData: null,
  floor: 1,
  room: 0,
  rewards: {},
  events: [],
  elapsedTime: 0,
  adventurerState: {}
}

const DungeonRuns = new Collection('dungeonRuns', DEFAULTS)
export default DungeonRuns