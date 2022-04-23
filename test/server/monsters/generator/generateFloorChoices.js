import { generateFloorChoices } from '../../../../server/monsters/generator.js'
import { expect } from 'chai'

describe('toDisplayName function', () => {

  it('Should handle trivial case', () => {
    const choices = generateFloorChoices(1, 1, 1, 0)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 }
    ])
  })

  it('Should handle range', () => {
    const choices = generateFloorChoices(1, 1, 5, 0)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 }
    ])
  })

  it('Should handle maxVal - minVal < range', () => {
    const choices = generateFloorChoices(1, 4, 5, 0)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 2 },
      { weight: 100, value: 3 },
      { weight: 100, value: 4 }
    ])
  })

  it('Should handle maxVal - minVal > range', () => {
    const choices = generateFloorChoices(1, 9, 5, 0)
    expect(choices).to.deep.equal([
      { weight: 100, value: 5 },
      { weight: 100, value: 6 },
      { weight: 100, value: 7 },
      { weight: 100, value: 8 },
      { weight: 100, value: 9 }
    ])
  })

  it('Should skew', () => {
    const choices = generateFloorChoices(1, 9, 5, 0.25)
    expect(choices).to.deep.equal([
      { weight: 100, value: 5 },
      { weight: 125, value: 6 },
      { weight: 150, value: 7 },
      { weight: 175, value: 8 },
      { weight: 200, value: 9 }
    ])
  })

})
