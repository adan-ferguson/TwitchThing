import defaultOrbImg from '/client/assets/icons/orbs/default.svg'
import classDisplayInfo from '../classDisplayInfo.js'
import tippy from 'tippy.js'

const ORB_ENTRY_HTML = (src, text) => `
  <img src="${src}"> <span>${text}</span>
`

export const OrbsDisplayStyle = {
  USED_ONLY: 0,
  SHOW_MAX: 1,
  ADDITIVE: 2
}

export default class OrbRow extends HTMLElement{

  _text

  constructor(){
    super()
    // this.innerHTML = HTML
    // this._text = this.querySelector('.orbs-text')
  }

  setData(orbsData, style = OrbsDisplayStyle.USED_ONLY){
    this.innerHTML = ''
    if(!orbsData){
      return
    }
    orbsData.list.forEach(orbDatum => {
      this.appendChild(new OrbEntry(orbDatum, style))
    })
  }
}
customElements.define('di-orb-row', OrbRow)

class OrbEntry extends HTMLElement{
  constructor(orbDatum, style){
    super()

    let text
    if(style === OrbsDisplayStyle.SHOW_MAX){
      text = `${orbDatum.used}/${orbDatum.max}`
      this.classList.toggle('error', orbDatum.remaining < 0)
    }else if(style === OrbsDisplayStyle.ADDITIVE){
      text = (orbDatum.max >= 0 ? '+' : '') + orbDatum.max
    }else{
      text = '' + orbDatum.used
    }

    const classInfo = classDisplayInfo(orbDatum.className)
    this.innerHTML = ORB_ENTRY_HTML(classInfo.orbIcon || defaultOrbImg, text)
    tippy(this, {
      theme: 'light',
      content: `These orbs allow this adventurer to equip ${classInfo.displayName} items.\n\n${classInfo.description}`
    })
  }
}

customElements.define('di-orb-entry', OrbEntry)