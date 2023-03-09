import { advLevelToXp, advXpToLevel } from '../../../game/adventurer.js'

console.log(advLevelToXp(1))
console.log(advLevelToXp(2))
console.log(advLevelToXp(3))
console.log(advLevelToXp(4))
console.log(advLevelToXp(5))
console.log(advLevelToXp(10))
console.log(advLevelToXp(50))
console.log(advLevelToXp(100))

for(let i = 2; i <= 100; i++){
  const xp = advLevelToXp(i)
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