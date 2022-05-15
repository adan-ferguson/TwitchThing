import defaultOrbImg from '/client/assets/icons/orbs/default.svg'
import classDisplayInfo from '../classDisplayInfo.js'
//
// const HTML = `
// <span class="orb" data-orb-index="1"></span>
// <span class="orb" data-orb-index="2"></span>
// <span class="orb" data-orb-index="3"></span>
// `
//
// const ORB_HTML = (type, text) => `
//   <img alt="Orbs" src="${orbImg}">
//   <span class="orbs-text"></span>
// `

const ORB_ENTRY_HTML = (src, text) => `
  <img src="${src}"> <span>${text}</span>
`

export default class OrbRow extends HTMLElement{

  _text

  constructor(){
    super()
    // this.innerHTML = HTML
    // this._text = this.querySelector('.orbs-text')
  }

  setData(orbsData, showMax = false){
    this.innerHTML = ''
    orbsData.list.forEach(orbDatum => {
      this.appendChild(new OrbEntry(orbDatum, showMax))
    })
  }
}
customElements.define('di-orb-row', OrbRow)

class OrbEntry extends HTMLElement{
  constructor(orbDatum, showMax = false){
    super()

    let text
    if(showMax){
      text = `${orbDatum.used}/${orbDatum.max}`
      this.classList.add('error')
    }else{
      text = '' + orbDatum.used
    }

    const classInfo = classDisplayInfo(orbDatum.className)
    this.innerHTML = ORB_ENTRY_HTML(classInfo.orbIcon || defaultOrbImg, text)
  }
}

customElements.define('di-orb-entry', OrbEntry)