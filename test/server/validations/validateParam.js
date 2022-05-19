import { expect } from 'chai'
import { validateParam } from '../../../server/validations.js'

describe('validateParam function', () => {

  it('Should reject if param is undefined', () => {
    expect(() => validateParam(undefined)).to.throw()
  })

  it('Should accept if param is anything else', () => {
    expect(() => validateParam(0)).to.not.throw()
    expect(() => validateParam('')).to.not.throw()
    expect(() => validateParam([])).to.not.throw()
    expect(() => validateParam({})).to.not.throw()
    expect(() => validateParam(null)).to.not.throw()
  })

  it('Should accept if param is undefined but options specify required = false', () => {
    expect(() => validateParam(undefined, { required: false })).to.not.throw()
  })

  it('Should respect type: array', () => {
    expect(() => validateParam('a', { type: 'array' })).to.throw()
    expect(() => validateParam(null, { type: 'array', required: false })).to.throw()
    expect(() => validateParam(undefined, { type: 'array', required: false })).to.not.throw()
    expect(() => validateParam([], { type: 'array' })).to.not.throw()
    expect(() => validateParam([1], { type: 'array' })).to.not.throw()
  })

  it('Options = true should be the same as default value', () => {
    expect(() => validateParam(undefined, true)).to.throw()
    expect(() => validateParam(null, true)).to.not.throw()
  })

  it('Should respect type being a nested object', () => {
    expect(() => validateParam({ a: 1, b: 2 }, {
      type: {
        a: true,
        b: true
      }
    })).to.not.throw()
    expect(() => validateParam({ a: 1 }, {
      type: {
        a: true,
        b: true
      }
    })).to.throw()
  })

  it('Should handle properties of nested objects', () => {
    expect(() => validateParam({ a: 1 }, {
      type: {
        a: { type: 'array' }
      }
    })).to.throw()

    expect(() => validateParam({ a: { b: undefined, c: [], d: null } }, {
      type: {
        a: {
          type: {
            b: { required: false },
            c: { type: 'array' },
            d: true
          }
        }
      }
    })).to.not.throw()
  })

})
