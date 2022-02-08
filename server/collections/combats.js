import db from '../db.js'

const DEFAULTS = {
  startTime: null,
  endTime: null,
  timeline: null,
  fighter1: null,
  fighter2: null
}

export async function save(combatDoc){
  return await db.save(fix(combatDoc), 'combats')
}

export async function fix(combatDoc, projection = null){
  return db.fix(combatDoc, DEFAULTS, projection)
}

export async function findOne(queryOrID, projection = {}){
  return await db.findOne('combats', queryOrID, projection, DEFAULTS)
}