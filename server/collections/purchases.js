import Collection from './collection.js'

const DEFAULTS = {
  userID: null,
  timestamp: null,
  purchased: null,
  spent: null
}

const Purchases = new Collection('purchases', DEFAULTS)

export default Purchases