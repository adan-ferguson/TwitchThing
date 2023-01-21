import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const multiplierValue = valueFns[StatType.MULTIPLIER]

describe('multiplier valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = multiplierValue([], 0.25)
    expect(val.value).to.be.closeTo(0.25, 0.001,'Default value provided')
  })

  it('Should support pct format for flat increases', () => {
    const val = multiplierValue(['10%', '+20%'], 1)
    expect(val.value).to.be.closeTo(1.3, 0.001,'Decimal format works for increases')
  })

  it('Should support pct format for multiplicative decreases', () => {
    const val = multiplierValue(['-10%', '-20%'], 1)
    expect(val.value).to.be.closeTo(0.72, 0.001, 'Decimal format works for decreases')
  })

  it('Should support pct format for multiplicative decreases', () => {
    const val = multiplierValue(['-10%', '30%', '50%', '-20%'], 1)
    expect(val.value).to.be.closeTo(1.5, 0.001, 'Decimal format works for decreases')
  })

})