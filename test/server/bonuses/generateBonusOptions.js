import { generateBonusOptions as gbo } from '../../../server/adventurer/bonuses.js'

// describe('generateBonusOptions function', () => {
//
//   it('Should debug test test test', () => {
//     const options = gbo({}, {})
//     console.log(options)
//   })
// })

const options = gbo({
  features: {
    advClasses: {
      fighter: 1
    }
  }
}, {
  items: []
})