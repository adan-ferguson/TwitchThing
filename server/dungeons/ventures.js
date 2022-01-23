import { addRun } from './dungeonRunner.js'
import { addRewards, loadByIDs } from '../collections/dungeonRuns.js'
import * as Adventurers from '../collections/adventurers.js'
import * as Users from '../collections/users.js'
import { emit } from '../socketServer.js'
import { xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { previewLevelup } from '../adventurer/leveler.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'

export async function getByAdventurerID(adventurerID){
  const data = await Adventurers.findOne(adventurerID, {
    currentVenture: 1
  })
  return data.currentVenture
}

// TODO: more options
export async function beginVenture(userID, adventurerID, dungeonID){

  if(await getByAdventurerID(adventurerID)){
    throw { code: 401, error: 'Can not enter dungeon, adventurer is already venturing.' }
  }

  // TODO: check if adventurer is allowed to run this dungeon

  const venture = {
    userID,
    adventurerID,
    dungeonID,
    finished: false,
    plan: {
      type: 'count',
      current: 0,
      limit: 1
    },
    results: null,
    startTime: new Date(),
    currentRun: null,
    finishedRuns: []
  }

  continueVenture(venture)
}

export async function runFinished(runID, adventurerID){
  const venture = await getByAdventurerID(adventurerID)
  if(!venture || !runID.equals(venture.currentRun)){
    // TODO: huh?
    return
  }
  venture.finishedRuns.push(venture.currentRun)
  venture.currentRun = null
  continueVenture(venture)
}

/**
 * Advance ventures that:
 * - Have no currentRun
 * - Have a currentRun that's not in progress
 * @param runsInProgress [id]
 * @returns {Promise<void>}
 */
export async function advanceVentures(runsInProgress){
  const runsObj = {}
  runsInProgress.forEach(runID => runsObj[runID.toString()] = 1)

  const ventures = await Adventurers.loadRunningVentures()
  for(let i = 0; i < ventures.length; i++){
    let venture = ventures[i]
    if(!venture.currentRun || !runsObj[venture.currentRun.toString()]){
      await continueVenture(venture)
    }
  }
}

export async function finalizeVenture(adventurerID, selectedBonuses){

  const adventurer = await Adventurers.findOne(adventurerID, {
    currentVenture: 1,
    name: 1,
    xp: 1,
    level: 1
  })

  const venture = adventurer.currentVenture

  if(!venture){
    throw { code: 401, error: 'Adventurer is not currently venturing.', targetPage: 'Adventurer' }
  }

  if(!venture.finished){
    return { code: 401, error: 'Venture is not finished yet.', targetPage: 'Dungeon' }
  }

  if(selectedBonuses.length !== venture.results.levelups.length){
    return { code: 401, error: 'Selected bonuses array length mismatched' }
  }

  await Promise.all([saveAdventurer(), saveUser()])

  async function saveAdventurer(){
    // TODO: save selected bonuses
    const xpAfter = adventurer.xp + venture.results.rewards.xp
    await Adventurers.update(adventurerID, {
      currentVenture: null,
      xp: xpAfter,
      level: advXpToLevel(xpAfter)
    })
  }

  async function saveUser(){
    // TODO: add level rewards
    const user = await Users.findOne(venture.userID)
    const xpAfter = user.xp + venture.results.rewards.xp
    await Users.update(venture.userID, {
      xp: xpAfter,
      level: userXpToLevel(xpAfter)
    })
  }
}

async function continueVenture(venture){

  if(venture.currentRun){
    venture.finishedRuns.push(venture.currentRun)
    venture.currentRun = null
  }

  let shouldStop = false
  if(venture.plan.type === 'count'){
    if(venture.plan.current >= venture.plan.limit){
      shouldStop = true
    }else{
      venture.plan.current++
    }
  }else if(venture.plan.type === 'time'){
    // TODO this
  }

  if(shouldStop){
    venture.results = await calculateResults(venture)
    venture.finished = true
  }else{
    const run = await addRun(venture.adventurerID, venture.dungeonID)
    venture.currentRun = run._id
  }

  await Adventurers.update(venture.adventurerID, { currentVenture: venture })
  emit(venture.userID, 'venture update', venture)
}

/**
 * Create the "results" conglomeration value, which contains rewards and
 * information on what actions the user has to do (mainly regarding leveling up).
 * @param venture
 */
async function calculateResults(venture){
  const adventurer = await Adventurers.findOne(venture.adventurerID)
  const dungeonRuns = await loadByIDs(venture.finishedRuns)
  const rewards = {}
  dungeonRuns.forEach(run => {
    addRewards(rewards, run.rewards)
  })

  const levelAfter = advXpToLevel(adventurer.xp + rewards.xp)
  const levelups = []
  for(let levelBefore = adventurer.level; levelBefore < levelAfter; levelBefore++){
    levelups.push(previewLevelup(adventurer, levelBefore + 1))
  }

  return {
    rewards,
    levelups
  }
}