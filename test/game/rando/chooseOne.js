import { expect } from 'chai'
import { chooseOne } from '../../../game/rando.js'

describe('chooseOne function', () => {

  it('Should support format #1', () => {
    expect(chooseOne({
      a: 1,
      b: 2,
      c: 3
    }))
      .to
      .satisfy(val => val === 'a' || val === 'b' || val === 'c')
  })

  it('Should support format #2', () => {
    const anObj = { a: 3 }
    expect(chooseOne([1, 'b', anObj]))
      .to
      .satisfy(val => val === 1 || val === 'b' || val === anObj)
  })

  it('Should support format #3', () => {
    const anObj = { a: 3 }
    expect(chooseOne([
      { weight: 1, value: 1 },
      { weight: 1, value: 'b' },
      { weight: 1, value: anObj }
    ]))
      .to
      .satisfy(val => val === 1 || val === 'b' || val === anObj)
  })

  it('Should skew towards weights', () => {
    const reps = { a: 0, b: 0, c: 0 }
    for(let i = 0; i < 60000; i++){
      reps[chooseOne({ a: 1, b: 2, c: 3 })]++
    }
    expect(reps.a).to.be.closeTo(10000, 200)
    expect(reps.b / 2).to.be.closeTo(10000, 200)
    expect(reps.c / 3).to.be.closeTo(10000, 200)
  })

})
