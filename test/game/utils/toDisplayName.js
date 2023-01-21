import { toDisplayName } from '../../../game/utilFunctions.js'
import { expect } from 'chai'

describe('toDisplayName function', () => {

  it('Should handle an all lowercase word correctly', () => {
    expect(toDisplayName('abcde')).to.equal('Abcde')
  })

  it('Should handle a word that starts with a capital', () => {
    expect(toDisplayName('Abcde')).to.equal('Abcde')
  })

  it('Should add a space when a lowercase letter is followed with an uppercase', () => {
    expect(toDisplayName('abcDefGhi')).to.equal('Abc Def Ghi')
  })

  it('Should not add a space before symbols', () => {
    expect(toDisplayName('multi-headed')).to.equal('Multi-Headed')
    expect(toDisplayName('multi.headed')).to.equal('Multi.Headed')
  })

})
