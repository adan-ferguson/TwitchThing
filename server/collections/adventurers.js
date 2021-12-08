import db from '../db.js'

const DEFAULTS = {
  name: null,
  level: 1,
  userid: null
}

export async function save(adventurerDoc){
  await db.save(adventurerDoc, 'adventurers')
}

export async function loadByIDs(_ids, projection = {}){
  return await db.conn().collection('adventurers').find({
    _id: { $in: _ids }
  }, { projection: projection }).toArray()
}

export async function createNew(userid, name){
  const adventurerDoc = {
    ...DEFAULTS,
    name,
    userid
  }
  await save(adventurerDoc)
  return adventurerDoc
}