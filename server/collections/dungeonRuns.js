import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  adventurer: null,
  dungeonOptions: {},
  finished: false,
  finalized: null,
  results: null,
  floor: 1,
  room: 1,
  rewards: {},
  events: [],
  elapsedTime: 0,
  startTime: 0,
  purged: false,
  adventurerState: {}
}

const DungeonRuns = new Collection('dungeonRuns', DEFAULTS)
export default DungeonRuns