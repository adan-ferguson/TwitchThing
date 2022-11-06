import { advLevelToXp, advXpToLevel } from '../../../game/adventurerInstance.js'

console.log(advLevelToXp(1))
console.log(advLevelToXp(5))
console.log(advLevelToXp(10))
console.log(advLevelToXp(50))
console.log(advLevelToXp(100))

console.log(advXpToLevel(0), 0)
console.log(advXpToLevel(576), 4)
console.log(advXpToLevel(577), 5)
console.log(advXpToLevel(578), 5)
console.log(advXpToLevel(2589), 9)
console.log(advXpToLevel(2590), 10)
console.log(advXpToLevel(2591), 10)
console.log(advXpToLevel(22499999), 49)
console.log(advXpToLevel(22500000), 50)
console.log(advXpToLevel(22500000), 50)