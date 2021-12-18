import db from '../db.js'


const DEFAULTS = {
  _id: null,
  name: null,
  level: 1,
  xp: 0,
  userid: null,
  loadout: [null, null, null, null, null, null, null, null],
  currentVenture: null
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

export async function createNew(userid, name){
  return await save({ name, userid })
}

export async function loadData(_id, projection = {}){
  const adventurerDoc = await db.conn().collection('adventurers')
    .findOne({ _id }, { projection })
  if(!adventurerDoc){
    throw { code: 401, error: 'Invalid adventurer ID.' }
  }
  if(projection.loadout){
    // TODO: load the loadout items
    // adventurerDoc.loadout = Items.loadByIds(adventurerDoc.loadout)
  }
  return fix(adventurerDoc, projection)
}

export async function update(_id, $set = {}){
  return await db.conn().collection('adventurers').updateOne({ _id }, { $set })
}

export async function loadRunningVentures() {
  const adventurers = await db.conn().collection('adventurers').find({
    'currentVenture.status': 'Running'
  }, {
    projection: {
      currentVenture: 1
    }
  }).toArray()
  return adventurers.map(adv => adv.currentVenture)
}