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

import { speedToTurnTime } from '../../game/fighterInstance.js'

for(let i = 0; i < 500; i = i + 10){
  // console.log(i, speedToTurnTime(i))
  console.log(-i, speedToTurnTime(-i))
}