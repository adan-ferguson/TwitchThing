import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const additiveMultiplierValue = valueFns[StatType.ADDITIVE_MULTIPLIER]

describe('additive multiplier valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = additiveMultiplierValue([], 0.25)
    expect(val).to.be.closeTo(0.25, 0.001,'Default value provided')
  })

  it('Should support decimal format for increases', () => {
    const val = additiveMultiplierValue([1.1, 1.2], 1)
    expect(val).to.be.closeTo(1.3, 0.001,'Decimal format works for increases')
  })

  it('Should support decimal format for decreases', () => {
    const val = additiveMultiplierValue([0.9, 0.8], 1)
    expect(val).to.be.closeTo(0.72, 0.001, 'Decimal format works for decreases')
  })

  it('Should support pct format for increases', () => {
    const val = additiveMultiplierValue(['10%', '+20%'], 1)
    expect(val).to.be.closeTo(1.3, 0.001,'Decimal format works for increases')
  })

  it('Should support pct format for decreases', () => {
    const val = additiveMultiplierValue(['-10%', '-20%'], 1)
    expect(val).to.be.closeTo(0.72, 0.001, 'Decimal format works for decreases')
  })

  it('Should support everything mixed', () => {
    const val = additiveMultiplierValue([1.3, '-20%', '50%', 0.5], 1)
    expect(val).to.be.closeTo(0.72, 0.001, 'Mixed')
  })
})