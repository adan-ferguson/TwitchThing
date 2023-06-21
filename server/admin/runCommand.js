import { cancelAllRuns } from '../dungeons/dungeonRunner.js'
import Users from '../collections/users.js'
import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Combats from '../collections/combats.js'
import Purchases from '../collections/purchases.js'
import { getAllItemKeys } from '../../game/adventurerClassInfo.js'
import { purgeAllOldRuns } from '../dungeons/results.js'

export async function runCommand(cmd){
  return (await COMMANDS[cmd]?.()) ?? 'Command not found'
}

const COMMANDS = {
  'reset all': async () => {
    cancelAllRuns()
    await Promise.all([
      Users.resetAll(),
      Adventurers.removeAll(),
      DungeonRuns.removeAll(),
      Combats.removeAll(),
      Purchases.removeAll()
    ])
    return 'Everything has been successfully reset.'
  },
  purge: async () => {
    const removed = await purgeAllOldRuns()
    return `Old runs purged. ${removed} combats removed.`
  },
  'give stuff': async () => {
    const users = await Users.find()
    const newItems = {}
    getAllItemKeys().forEach(key => {
      newItems[key] = 10
    })
    users.forEach(userDoc => {
      userDoc.inventory.items.basic = { ...newItems }
      userDoc.inventory.stashedXp += 100000000
      userDoc.inventory.gold += 100000000
      userDoc.inventory.scrap += 100000000
      userDoc.features.shop = 1
      userDoc.features.workshop = 1
      userDoc.features.skills = 1
      userDoc.features.advClasses.rogue = 2
      userDoc.features.advClasses.chimera = 0
      Users.save(userDoc)
    })
    return 'Stuff given'
  },
  'stop runs': async () => {
    cancelAllRuns()
    Adventurers.collection.updateMany({}, [{
      $unset: 'dungeonRunID'
    }])
    return 'runs cancelled'
  }
}