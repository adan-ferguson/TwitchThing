import { adjustedDifficultyLevel } from '../../../game/monsterInstance.js'

const adl = adjustedDifficultyLevel

for(let i = 1; i <= 60; i++){
  console.log(i, adl(i))
}