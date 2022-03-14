import CustomAnimation from '../customAnimation.js'
import FlyingTextEffect from '../effects/flyingTextEffect.js'

const innerHTML = `
<div class="bar-badge displaynone">
    <span></span>
</div>
<div class="bar-border">
    <div class="bar-fill bar-background"></div>
    <div class="bar-fill bar-foreground"></div>
    <div class="bar-label"></div>
</div>
`

const ANIM_SPEED = 2000

export default class Bar extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._val = 0
    this._min = 0
    this._max = 100
    this._label = ''
    this._color = '#DDD'
    this._increaserColor = null
    this._decreaserColor = null
    this._barLabel = this.querySelector('.bar-label')
    this._barBackground = this.querySelector('.bar-background')
    this._barForeground = this.querySelector('.bar-foreground')
    this._showValueBeforeLabel = true

    this.setValue(0)
  }

  get animSpeed(){
    return ANIM_SPEED
  }

  get value(){
    return this._val
  }

  set showValueBeforeLabel(val){
    this._showValueBeforeLabel = val ? true : false
  }

  set color(val){
    this._color = val
  }

  set increaserColor(val){
    this._increaserColor = val
  }

  set decreaserColor(val){
    this._decreaserColor = val
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

  setMax(val){
    this.setRange(0, val)
  }

  setRange(min, max){
    this._min = min
    this._max = max
  }

  async setValue(val, options = {}){

    if(isNaN(parseFloat(val))){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    options = {
      animate: false,
      flyingText: false,
      ...options
    }

    val = Math.min(this._max, Math.max(this._min, Math.round(val)))

    if(options.flyingText){
      this._flyingText(val - this._val)
    }

    if(!options.animate){
      this._val = val
      this._setLabel(this._val)
      this._barBackground.classList.add('hidden')
      this._barBackground.style.width = `${this._pct(val) * 100}%`
      this._barForeground.style.width = `${this._pct(val) * 100}%`
      this._barForeground.style.backgroundColor = this._color
    }else {
      await this._animateToValue(val)
    }
  }

  setLabel(label = null){
    this._label = label
  }

  _animateToValue(val){

    function setWidth(bar, pct){
      bar.style.width = `${pct * 100}%`
    }

    return new Promise(res => {

      if(this.animation){
        this.animation.cancel()
      }

      const growing = val > this._val
      const secondaryColor = growing ? this._increaserColor : this._decreaserColor

      let animatingBar
      let snappingBar
      if(secondaryColor){
        animatingBar = growing ? this._barForeground : this._barBackground
        snappingBar = !growing ? this._barForeground : this._barBackground
        this._barBackground.classList.remove('hidden')
        this._barBackground.style.backgroundColor = secondaryColor
      }else{
        animatingBar = this._barForeground
        snappingBar = null
        this._barBackground.classList.add('hidden')
      }

      // Figure out our target width
      const startWidth = (parseFloat(animatingBar.style.width) / 100) || 0
      const targetWidth = this._pct(val)
      let currentWidth = startWidth

      this._val = val

      this.animation = new CustomAnimation({
        duration: this.animSpeed * Math.sqrt(Math.abs(targetWidth - currentWidth)),
        easing: 'easeOut',
        start: () => {
          if(snappingBar){
            setWidth(snappingBar, targetWidth)
          }
        },
        cancel: () => {
          this.animation = null
          res()
        },
        finish: () => {
          this.animation = null
          this.setValue(val)
          res()
        },
        tick: pct => {
          currentWidth = startWidth * (1 - pct) + targetWidth * pct
          setWidth(animatingBar, currentWidth)
          this._setLabel(Math.round(this._pctToVal(currentWidth)))
        }
      })
    })
  }

  _pct(val){
    const pct = (val - this._min) / (this._max - this._min)
    return Math.min(1, Math.max(0, pct))
  }

  _pctToVal(pct){
    pct = Math.min(1, Math.max(0, pct))
    return this._min * (1 - pct) + this._max * pct
  }

  _setLabel(val){
    const valueText = this._showValueBeforeLabel ? `${val} / ${this._max} ` : ''
    this._barLabel.textContent = `${valueText}${this._label || ''}`
  }

  _valToColor(val){
    if(typeof(this._color) === 'function'){
      return this._color(this._pct(val))
    }
    return this._color
  }

  _flyingText(text, options = {}){
    new FlyingTextEffect(this, text, options)
  }
}

customElements.define('di-bar', Bar)