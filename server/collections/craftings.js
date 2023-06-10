import Collection from './collection.js'

const DEFAULTS = {
  userID: null,
  timestamp: null,
  type: null, // upgrade/scrap
  itemDef: null,
  data: null,
}

const Craftings = new Collection('craftings', DEFAULTS)

export default Craftings