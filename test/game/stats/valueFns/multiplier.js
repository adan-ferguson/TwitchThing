import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const multiplierValue = valueFns[StatType.MULTIPLIER]

describe('multiplier valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = multiplierValue([], 0.25)
    expect(val).to.be.closeTo(0.25, 0.001,'Default value provided')
  })

  it('Should support decimal format for increases', () => {
    const val = multiplierValue([1.1, 1.2], 1)
    expect(val).to.be.closeTo(1.3, 0.001,'Decimal format works for increases')
  })

  it('Should support decimal format for decreases', () => {
    const val = multiplierValue([0.9, 0.8], 1)
    expect(val).to.be.closeTo(0.72, 0.001, 'Decimal format works for decreases')
  })

  it('Should support pct format for flat increases', () => {
    const val = multiplierValue(['10%', '+20%'], 1)
    expect(val).to.be.closeTo(1.3, 0.001,'Decimal format works for increases')
  })

  it('Should support pct format for multiplicative decreases', () => {
    const val = multiplierValue(['-10%', '-20%'], 1)
    expect(val).to.be.closeTo(0.72, 0.001, 'Decimal format works for decreases')
  })

  it('Should support everything mixed', () => {
    const val = multiplierValue([1.2, '80%', '-50%', 0.6], 1)
    expect(val).to.be.closeTo(0.6, 0.001, 'Mixed')
  })
})