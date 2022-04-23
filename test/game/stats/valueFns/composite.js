import { expect } from 'chai'
import valueFns from '../../../../game/stats/statValueFns.js'
import { StatType } from '../../../../game/stats/statDefinitions.js'

const compositeValue = valueFns[StatType.COMPOSITE]

describe('composite valueFn', () => {

  it('Should default to provided defaultValue', () => {
    const val = compositeValue([], 5)
    expect(val).to.equal(5, 'Default value provided')
  })

  it('Should combine flat positive values', () => {
    const val = compositeValue([1.2, 2.4, 8], -2)
    expect(val).to.equal(9.6, 'Sum values')
  })

  it('Should combine flat negative values', () => {
    const val = compositeValue([-1.2, -2.4, -8], 0)
    expect(val).to.equal(-11.6, 'Sum values')
  })

  it('Should work with both flat types', () => {
    const val = compositeValue([1.2, -2.4, 1.8], 0)
    expect(val).to.closeTo(0.6, 0.001, 'Sum values')
  })

  it('Should be multiplicative with positive percentage values', () => {
    const val = compositeValue(['10%', '+20%'], 100)
    expect(val).to.closeTo(132, 0.001, '10 times 1.1 times 1.2')
  })

  it('Should be multiplicative with negative percentage values', () => {
    const val = compositeValue(['-10%', '-20%'], 100)
    expect(val).to.closeTo(72, 0.001, '100 times 0.9 times 0.8')
  })

  it('Pct types do not really cancel out', () => {
    const val = compositeValue(['10%', '-20%', '+10%'], 1000)
    expect(val).to.closeTo(968, 0.001, '1000 * 1.1 * 1.1 * 0.8')
  })

  it('Should ignore order of flat and percentage', () => {
    const val = compositeValue(['-20%', 10, '+10%', -20, '10%'], 1010)
    expect(val).to.closeTo(968, 0.001, '(1010 - 20 + 10) * 1.1 * 1.1 * 0.8')
  })
})