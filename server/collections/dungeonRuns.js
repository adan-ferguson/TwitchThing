import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  adventurer: null,
  dungeonOptions: {},
  finished: false,
  finalized: null,
  results: {},
  floor: 1,
  room: 1,
  rewards: {},
  events: null, // deprecated
  elapsedTime: 0,
  startTime: 0,
  purged: false,
  adventurerState: {},
  cancelled: false,
}

const DungeonRuns = new Collection('dungeonRuns', DEFAULTS)

export default DungeonRuns