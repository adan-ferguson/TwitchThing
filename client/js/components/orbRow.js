import orbImg from '/client/assets/icons/orb.svg'

const HTML = `
<img alt="Orbs" src="${orbImg}">
<span class="orbs-text"></span>
`

export default class OrbRow extends HTMLElement{

  _text

  constructor(){
    super()
    this.innerHTML = HTML
    this._text = this.querySelector('.orbs-text')
  }

  setValue(value){
    this._text.textContent = '' + value
  }

  setData(orbsData, showMax = false){
    if(showMax){
      this._text.textContent = `${orbsData.used}/${orbsData.max}`
      this._text.classList.toggle('error', orbsData.remaining < 0)
    }else{
      this._text.textContent = '' + orbsData.used
    }
  }
}

customElements.define('di-orb-row', OrbRow)