import db from '../db.js'

const DEFAULTS = {
  _id: null,
  name: null,
  level: 1,
  xp: 0,
  userID: null,
  loadout: [null, null, null, null, null, null, null, null],
  dungeonRunID: null,
  baseStats: {
    hpMax: 100,
    attack: 10
  },
  levelups: []
}

async function save(adventurerDoc){
  return await db.save(fix(adventurerDoc), 'adventurers')
}

function fix(adventurerDoc, projection = null){
  return db.fix(adventurerDoc, DEFAULTS, projection)
}

export async function loadByIDs(_ids, projection = {}){
  const adventurers = await db.conn().collection('adventurers').find({
    _id: { $in: _ids }
  }, { projection }).toArray()
  return adventurers.map(adventurer => fix(adventurer, projection))
}

export async function createNew(userID, name){
  return await save({ name, userID })
}

export async function findOne(queryOrID, projection = {}){
  return await db.findOne('adventurers', queryOrID, projection, DEFAULTS)
}

export async function update(_id, $set = {}){
  return await db.conn().collection('adventurers').updateOne({ _id }, { $set })
}