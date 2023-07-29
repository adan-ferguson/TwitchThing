import Collection from './collection.js'

const DEFAULTS = {
  duration: null,
  timeline: null,
  result: null,
  fighter1: null,
  fighter2: null,
  date: null,
  floor: 1,
  times: {},
  params: {},
  _id: null
}

const Combats = new Collection('combats', DEFAULTS)
export default Combats