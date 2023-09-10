import Collection from '../collections/collection.js'
import Adventurers from '../collections/adventurers.js'
import { updateAccomplishments } from '../user/accomplishments.js'
import Users from '../collections/users.js'
import { removeInvalidSkills } from './deleteSkill.js'
import { msToS } from '../../game/utilFunctions.js'

const Migrations = new Collection('migrations', {
  migrationId: null
})

export async function runMigrations(){
  console.log('running migrations')
  await migration(81, setUserAdvClassAccomplishments)
  await migration(83, async () => await removeInvalidSkills())
  console.log('done')
}

async function migration(migrationId, fn){
  const m = await Migrations.findOne({ query: { migrationId } })
  if(m){
    return
  }
  const time = Date.now()
  console.log('running migration', migrationId)
  await fn()
  console.log('finished migration', migrationId, msToS(Date.now() - time))
  Migrations.save({ migrationId })
}

async function setUserAdvClassAccomplishments(){
  for(let userDoc of await Users.find()){
    userDoc.accomplishments.advClasses = {}
    const advs = await Adventurers.find({
      query: {
        userID: userDoc._id
      }
    })
    for(let advDoc of advs){
      updateAccomplishments(userDoc, advDoc)
    }
    await Users.save(userDoc)
  }
}