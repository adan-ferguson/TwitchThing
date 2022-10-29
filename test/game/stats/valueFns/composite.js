import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const compositeValue = valueFns[StatType.COMPOSITE]

describe('composite valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = compositeValue([], 5)
    expect(val.value).to.equal(5, 'Default value provided')
  })

  it('Should combine flat positive values', () => {
    const val = compositeValue([1.2, 2.4, 8], -2)
    expect(val.value).to.equal(9.6, 'Sum values')
  })

  it('Should combine flat negative values', () => {
    const val = compositeValue([-1.2, -2.4, -8], 0)
    expect(val.value).to.equal(-11.6, 'Sum values')
  })

  it('Should work with both flat types', () => {
    const val = compositeValue([1.2, -2.4, 1.8], 0)
    expect(val.value).to.closeTo(0.6, 0.001, 'Sum values')
  })

  it('Should be multiplicative with positive percentage values', () => {
    const val = compositeValue(['10%', '+20%'], 100)
    expect(val.value).to.closeTo(130, 0.001, '10 times 1.1 times 1.2')
  })

  it('Should be multiplicative with negative percentage values', () => {
    const val = compositeValue(['-10%', '-30%'], 100)
    expect(val.value).to.closeTo(63, 0.001, '100 times 0.9 times 0.8')
  })

  it('Pct types cancel out', () => {
    const val = compositeValue(['10%', '-30%', '+10%', '-10%'], 1000)
    expect(val.value).to.closeTo(800, 0.001)
    const val2 = compositeValue(['10%', '-10%', '+10%', '-30%'], 1000)
    expect(val2.value).to.closeTo(800, 0.001)
  })

  it('Multipliers', () => {
    const val = compositeValue(['1.1x', '1.1x'], 1000)
    expect(val.value).to.closeTo(1210, 0.001)
  })

  it('Flat then multiply', () => {
    const val = compositeValue([500, '1.1x'], 1000)
    expect(val.value).to.closeTo(1650, 0.001, '1000 * 1.1 * 1.1 * 0.8')
  })

  it('Flat then pct', () => {
    const val = compositeValue(['20%', 500, '20%'], 1000)
    expect(val.value).to.closeTo(2100, 0.001, '1000 * 1.1 * 1.1 * 0.8')
  })

  it('Pct then multiply', () => {
    const val = compositeValue(['20%', '-50%', '2x', '0.2x'], 1000)
    expect(val.value).to.closeTo(280, 0.001, '1000 * 1.1 * 1.1 * 0.8')
  })

})