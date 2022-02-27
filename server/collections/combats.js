import Collection from './collection.js'

const DEFAULTS = {
  startTime: null,
  endTime: null,
  timeline: null,
  fighter1: null,
  fighter2: null
}

const Combats = new Collection('combats', DEFAULTS)
export default Combats