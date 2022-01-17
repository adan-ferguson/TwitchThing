const innerHTML = `
<div class="bar-badge displaynone">
    <span></span>
</div>
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
    this.decimals = 0
    this.barLabel = this.querySelector('.bar-label')
    this.barFill = this.querySelector('.bar-fill')
  }

  setBadge(text){
    const badge = this.querySelector('.bar-badge')
    if(text){
      badge.classList.remove('displaynone')
      badge.querySelector('span').textContent = text
    }else{
      badge.classList.add('displaynone')
    }
  }

  setRange(min, max){
    this.min = min
    this.max = max
  }

  setValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    val = Math.min(this.max, Math.max(this.min, Math.round(val)))

    this._val = val
    this.barLabel.textContent = `${this._val} / ${this.max}`
    this.querySelector('.bar-fill').style.width = `${this._pct(val) * 100}%`
  }

  setFill(val){
    this.barFill.style.backgroundColor = val
  }

  animateValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    return new Promise(res => {
      this.animation = this.barFill.animate([
        { width: `${this._pct(val) * 100}%` }
      ], {
        duration: TIME_TO_FILL_ONE_BAR,
        easing: 'ease-out'
      })
      this.animation.onfinish = () => {
        this.setValue(val)
        res()
      }
    })
  }

  _pct(val){
    const pct = (val - this.min) / (this.max - this.min)
    return Math.min(1, Math.max(0, pct))
  }
}

customElements.define('di-bar', Bar)