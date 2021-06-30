const db = require('../db.js')

module.exports = {
  load: async (id) => {
    // TODO: this LOL
    return await db.conn().collection('users').findOne(db.id(id))
  }
}
