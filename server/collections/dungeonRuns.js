import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  adventurer: null,
  dungeonOptions: {
    startingFloor: 1
  },
  finished: false,
  finalized: false,
  floor: 1,
  room: 0,
  rewards: {},
  events: [],
  timeSinceLastEvent: 0,
  elapsedTime: 0,
  adventurerState: {}
}

const DungeonRuns = new Collection('dungeonRuns', DEFAULTS)
export default DungeonRuns