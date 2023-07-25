import { roundToNearestIntervalOf } from '../../../game/utilFunctions.js'

console.log(roundToNearestIntervalOf(123.456, 0.02))
console.log(roundToNearestIntervalOf(123.456, 0.2))
console.log(roundToNearestIntervalOf(123.456, 2))
console.log(roundToNearestIntervalOf(123.456, 20))
console.log(roundToNearestIntervalOf(123.456, 200))
console.log(roundToNearestIntervalOf(4.03999999, 0.0001))