import Collection from './collection.js'

const DEFAULTS = {
  startTime: null,
  duration: null,
  timeline: null,
  result: null,
  fighter1: null,
  fighter2: null
}

const Combats = new Collection('combats', DEFAULTS)
export default Combats