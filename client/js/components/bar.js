const innerHTML = `
<div class="bar-badge displaynone">
    <span></span>
</div>
<div class="bar-border">
    <div class="bar-fill"></div>
    <div class="bar-label"></div>
</div>
`

const ANIM_TIME = 1000

export default class Bar extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._min = 0
    this._max = 100
    this._label = ''
    this._barLabel = this.querySelector('.bar-label')
    this._barFill = this.querySelector('.bar-fill')
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
    this._min = min
    this._max = max
  }

  setValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    val = Math.min(this._max, Math.max(this._min, Math.round(val)))

    this._val = val
    this._barLabel.textContent = `${this._val} / ${this._max} ${this._label}`
    this.querySelector('.bar-fill').style.width = `${this._pct(val) * 100}%`
  }

  setFill(val){
    this._barFill.style.backgroundColor = val
  }

  setLabel(label = null){
    this._label = label
  }

  animateValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    return new Promise(res => {
      requestAnimationFrame(() => {
        this.animation = this._barFill.animate([
          { width: `${this._pct(this._val) * 100}%` },
          { width: `${this._pct(val) * 100}%` }
        ], {
          duration: ANIM_TIME,
          easing: 'ease-out'
        })
        this.animation.onfinish = () => {
          this.setValue(val)
          res()
        }
      })
    })
  }

  _pct(val){
    const pct = (val - this._min) / (this._max - this._min)
    return Math.min(1, Math.max(0, pct))
  }
}

customElements.define('di-bar', Bar)