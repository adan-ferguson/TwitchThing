import { generateFloorChoices } from '../../../../server/dungeons/monsters.js'
import { expect } from 'chai'

describe('generateFloorChoices function', () => {

  it('Should handle trivial case', () => {
    const choices = generateFloorChoices(1)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 }
    ])
  })

  it('Should handle range', () => {
    const choices = generateFloorChoices(1, 5)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 1 }
    ])
  })

  it('Should handle floor < range', () => {
    const choices = generateFloorChoices(4, 5)
    expect(choices).to.deep.equal([
      { weight: 100, value: 1 },
      { weight: 100, value: 1 },
      { weight: 100, value: 2 },
      { weight: 100, value: 3 },
      { weight: 100, value: 4 }
    ])
  })

  it('Should handle floor > range', () => {
    const choices = generateFloorChoices(9, 5)
    expect(choices).to.deep.equal([
      { weight: 100, value: 5 },
      { weight: 100, value: 6 },
      { weight: 100, value: 7 },
      { weight: 100, value: 8 },
      { weight: 100, value: 9 }
    ])
  })

  it('Should skew', () => {
    const choices = generateFloorChoices(9, 5, 0.25)
    expect(choices).to.deep.equal([
      { weight: 100, value: 5 },
      { weight: 125, value: 6 },
      { weight: 150, value: 7 },
      { weight: 175, value: 8 },
      { weight: 200, value: 9 }
    ])
  })

  it('Should respect zones/tens digits', () => {
    const choices = generateFloorChoices(14, 5)
    expect(choices).to.deep.equal([
      { weight: 100, value: 11 },
      { weight: 100, value: 11 },
      { weight: 100, value: 12 },
      { weight: 100, value: 13 },
      { weight: 100, value: 14 }
    ])
  })

})
