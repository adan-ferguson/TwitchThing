import { expect } from 'chai'
import { floorSize } from '../../../../server/dungeons/stairs.js'
import scaledValue from '../../../../game/scaledValue.js'

describe('floorSize function', () => {

  it('Should handle unscaled', () => {
    expect(floorSize(1, 10)).to.equal(10)
    expect(floorSize(10, 20)).to.equal(20)
    expect(floorSize(100, 30)).to.equal(30)
  })

  it('Should handle floor scaling', () => {
    expect(floorSize(2, 10, 0.1)).to.equal(11)
    expect(floorSize(3, 10, 0.1)).to.equal(12)
    expect(floorSize(5, 10, 1)).to.equal(160)
  })

  it('Should apply bonus for floor multiples of 10', () => {
    expect(floorSize(110, 10, 0, 0, 5)).to.equal(50)
    expect(floorSize(99, 10, 0, 0, 2)).to.equal(10)
  })

  it('Should apply zone scaling', () => {
    expect(floorSize(5, 10, 0, 0.1)).to.equal(10)
    expect(floorSize(15, 10, 0, 0.1)).to.equal(11)
    expect(floorSize(25, 10, 0, 0.1)).to.equal(12)
  })

  it('Should do all', () => {
    const expected = Math.floor(2 * 2 * scaledValue(0.1, 9, 10))
    expect(floorSize(20, 10, 0.1, 1, 2)).to.equal(expected)
  })

})
