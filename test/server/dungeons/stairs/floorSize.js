import { expect } from 'chai'
import { floorSize } from '../../../../server/dungeons/stairs.js'

describe('floorSize function', () => {

  it('Should handle floor 1', () => {
    const size = floorSize(1, 10, 0.2, 2)
    expect(size).to.equal(10)
  })

  it('Should handle floor 2-9', () => {
    const size = floorSize(5, 10, 0.2, 2)
    expect(size).to.equal(10)
  })

  it('Should double for floor 10', () => {
    const size = floorSize(10, 10, 0.2, 2)
    expect(size).to.equal(20)
  })

  it('Should apply zone scale once for floor 11-19', () => {
    const size = floorSize(15, 10, 0.2, 2)
    expect(size).to.equal(12)
  })

  it('Should double for floor 20', () => {
    const size = floorSize(20, 10, 0.2, 2)
    expect(size).to.equal(24)
  })

  it('Should apply zone scale twice for floor 21-29', () => {
    const size = floorSize(25, 10, 0.2, 2)
    expect(size).to.equal(14)
  })

})
