const innerHTML = `
<div class="bar-badge hidden"></div>
<div class="bar-border">
    <div class="bar-fill"></div>
    <div class="bar-label"></div>
</div>
`

const TIME_TO_FILL_ONE_BAR = 1000

export default class Bar extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
    this.min = 0
    this.max = 100
    this.barFill = this.querySelector('.bar-fill')
  }

  setBadge(text){
    const badge = this.querySelector('.bar-badge')
    if(text){
      badge.classList.remove('hidden')
      badge.textContent = text
    }else{
      badge.classList.add('hidden')
    }
  }

  setLabel(text){
    this.querySelector('.bar-label').textContent = text
  }

  setRange(min, max){
    this.min = min
    this.max = max
  }

  setValue(val){
    this._val = val
    this.setAttribute('title', `${this._val}/${this.max}`)

    let pct = (val - this.min) / (this.max - this.min)
    pct = Math.min(1, Math.max(0, pct))

    this.querySelector('.bar-fill').style.width = `${pct * 100}%`
  }

  animateValueChange(diff){

    return new Promise(res => {

      if(this._currentTimeout){
        clearTimeout(this._currentTimeout)
      }

      const time = TIME_TO_FILL_ONE_BAR * diff / (this.max - this.min)
      this.barFill.style.transition = `width ${time}ms linear`
      this.setValue(this._val + diff)

      this._currentTimeout = setTimeout(() => {
        this.barFill.style.transition = 'initial'
        this._currentTimeout = null
        res()
      }, time)
    })
  }
}

customElements.define('di-bar', Bar)