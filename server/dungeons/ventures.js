import { addRun } from './dungeonRunner.js'
import { addRewards, loadByIDs } from '../collections/dungeonRuns.js'
import * as Adventurers from '../collections/adventurers.js'
import { emit } from '../socketServer.js'
import { xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { previewLevelup } from '../adventurer/leveler.js'

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
    venture.currentRun = run._id.toString()
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
    levelups.push(previewLevelup(adventurer))
  }

  return {
    rewards,
    levelups
  }
}