import MonsterInstance from '../../game/monsterInstance.js'

export function trySneak(adventurerInstance){
  return adventurerInstance.stats.get('sneakChance').value + Math.random() > 1
}

export function generateSneakEvent(dungeonRun, monsterDef){
  const rewards = monsterDef.rewards
  const mi = new MonsterInstance(monsterDef)
  rewards.xp *= (dungeonRun.adventurerInstance.stats.get('sneakXP').value - 1)
  rewards.xp = Math.round(rewards.xp)
  return {
    roomType: 'sneak',
    monsterDef,
    rewards,
    message: `${dungeonRun.adventurerInstance.displayName} sneaks past the ${mi.displayName}.`
  }
}