// import Picker from '../../game/picker.js'
//
// describe('Picker object', () => {
//
//   it('Should do something', () => {
//     const p = new Picker([
//       1, 2, 3, 4, 5, 6, 7, 8, 9, 10
//     ], {
//       valueFormula: i => i,
//       higherDeviation: 0.5,
//       lowerDeviation: 0.85
//     })
//     const x = p.pick(9)
//   })
// })

import { advLevelToXp } from '../../game/adventurer.js'

for(let i = 50; i < 200; i++){
  console.log(i, advLevelToXp(i))
}