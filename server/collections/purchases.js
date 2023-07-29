import Collection from './collection.js'

const DEFAULTS = {
  userID: null,
  timestamp: null,
  shopItem: null,
  count: null
}

const Purchases = new Collection('purchases', DEFAULTS)

export default Purchases