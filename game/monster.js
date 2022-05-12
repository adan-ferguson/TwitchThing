import scaledValue from './scaledValue.js'

const POWER_MULTIPLIER = 0.25

const HP_BASE = 40
const XP_BASE = 50
const POWER_BASE = 10

export function getScalingValue(lvl){
  const zones = Math.floor((lvl - 1) / 10)
  const iterations = lvl + zones
  return scaledValue(POWER_MULTIPLIER, iterations)
}

export function levelToXpReward(lvl){
  return getScalingValue(lvl) * XP_BASE
}

export function levelToHp(lvl){
  return getScalingValue(lvl) * HP_BASE
}

export function levelToPower(lvl){
  return getScalingValue(lvl) * POWER_BASE
}