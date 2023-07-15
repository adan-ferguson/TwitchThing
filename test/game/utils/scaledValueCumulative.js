import { advLevelToXp, advXpToLevel } from '../../../game/adventurer.js'
import { monsterLevelToXpReward } from '../../../game/monsterInstance.js'

for(let i = 2; i <= 100; i++){
  const xp = advLevelToXp(i)
  console.log(i, xp, monsterLevelToXpReward(i))
  test(advXpToLevel(xp - 1), i - 1)
  test(advXpToLevel(xp), i)
  test(advXpToLevel(xp + 1), i)
}
console.log('all good')

function test(a, b){
  if(a !== b){
    throw `${a} and ${b} were different.`
  }
}