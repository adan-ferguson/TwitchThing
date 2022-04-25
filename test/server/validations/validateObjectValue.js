import { expect } from 'chai'
import { validateObjectValue } from '../../../server/validations.js'

const TEST_OBJECT = {
  a: 1,
  b: 'two',
  c: false,
  d: [],
  e: [1,2,[3,4]],
  f: {
    g: 1,
    h: 'two',
    i: []
  }
}

describe('validateObjectValue function', () => {

  it('Should reject if param is missing', () => {
    const error = validateObjectValue(TEST_OBJECT, 'z')
    expect(error).to.be.a('string', 'Should return error for missing param')
  })

  it('Should accept if param exists', () => {
    const error = validateObjectValue(TEST_OBJECT, 'a')
    expect(error).to.be.undefined
  })

  it('Should accept if param exists even if param value is falsey', () => {
    const error = validateObjectValue(TEST_OBJECT, 'c')
    expect(error).to.be.undefined
  })

  it('Should accept if param is missing but options specify required = false', () => {
    const error = validateObjectValue(TEST_OBJECT, 'z', { required: false })
    expect(error).to.be.undefined
  })

  it('Should respect type: array', () => {
    let error = validateObjectValue(TEST_OBJECT, 'c', { type: 'array' })
    expect(error).to.be.a('string', 'Should return error for invalid type')
    error = validateObjectValue(TEST_OBJECT, 'd', { type: 'array' })
    expect(error).to.be.undefined
    error = validateObjectValue(TEST_OBJECT, 'e', { type: 'array' })
    expect(error).to.be.undefined
  })

  it('Options = true should be the same as default value', () => {
    let error = validateObjectValue(TEST_OBJECT, 'z', true)
    expect(error).to.be.a('string', 'Should return error for missing param')
    error = validateObjectValue(TEST_OBJECT, 'a', true)
    expect(error).to.be.undefined
  })

  it('Should respect type being a nested object', () => {
    let error = validateObjectValue(TEST_OBJECT, 'f', {
      type: {
        g: true,
        h: true,
        i: {
          type: 'array'
        },
        j: {
          required: false
        }
      }
    })
    expect(error).to.be.undefined
    error = validateObjectValue(TEST_OBJECT, 'f', {
      type: {
        g: true,
        h: {
          type: 'array'
        },
        i: {
          type: 'array'
        },
        j: {
          required: false
        }
      }
    })
    expect(error).to.be.a('string', 'Should return error for h not being an array.')
  })

})
