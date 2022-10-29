import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const percentageValue = valueFns[StatType.PERCENTAGE]

describe('percentage valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = percentageValue([], 0.25)
    expect(val.value).to.be.closeTo(0.25, 0.001,'Default value provided')
  })

  it('Should support pct format for increases', () => {
    const val = percentageValue(['10%', '+20%'], 0)
    expect(val.value).to.be.closeTo(0.28, 0.001,'Decimal format works for increases')
  })

  it('Should support pct format for decreases', () => {
    const val = percentageValue(['-10%', '-20%'], 0.5)
    expect(val.value).to.be.closeTo(0.36, 0.001, 'Decimal format works for decreases')
  })


})