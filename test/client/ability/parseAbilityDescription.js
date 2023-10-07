// import { parseDescriptionString } from '../../../client/js/descriptionString.js'
//
//
// console.log(parseDescriptionString('Normal'))
// console.log(parseDescriptionString('[P1.2]'))
// console.log(parseDescriptionString('[M1.2]'))
// console.log(parseDescriptionString('Blah blah [P0.7] and [M12]')
//
// )

function myFunc(nums, k){
  const SPLIT = 31
  let k1 = Math.min(SPLIT, k)
  let k2 = Math.max(0, k - SPLIT)
  let i1 = 0
  let i2 = 0
  let reps = 0
  const target1 = Math.pow(2, k1) - 1
  const target2 = Math.pow(2, k2) - 1
  while(i1 < target1 || i2 < target2){
    reps++
    const next = nums.at(-reps)
    if(next > k){
      continue
    }else if(next <= k1){
      i1 |= Math.pow(2, next - 1)
    }else{
      i2 |= Math.pow(2, next - 1 - SPLIT)
    }
  }
  return reps
}

console.log(myFunc([3,28,33,26,34,20,27,5,21,23,4,21,37,35,32,15,14,1,7,2,9,6,38,17,30,18,16,13,24,29,12,14,8,36,11,31,25,22,10,19], 38))