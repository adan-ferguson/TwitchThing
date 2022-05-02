import { iterations } from '../../../../server/monsters/generator.js'
import { expect } from 'chai'

describe('iterations function', () => {
  it('Taaa', () => {
    for(let i = 0; i <= 100; i++){
      console.log(i, iterations(i))
    }
  })
})
