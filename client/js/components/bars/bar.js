import CustomAnimation from '../../customAnimation.js'
import FlyingTextEffect from '../effects/flyingTextEffect.js'
import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'

const innerHTML = `
<div class="bar-badge displaynone">
</div>
<div class="bar-border">
    <div class="bar-fill bar-background"></div>
    <div class="bar-fill bar-foreground"></div>
    <div class="bar-label"></div>
</div>
`

const ANIM_SPEED = 2000

export default class Bar extends HTMLElement{

  _options = {
    label: '',
    color: '#DDD',
    showLabel: true,
    showValue: true,
    showMax: true,
    increaserColor: null,
    decreaserColor: null,
    min: 0,
    max: 100
  }

  _barLabel
  _barBackground
  _barForeground

  _val = 0

  constructor(){
    super()
    this.classList.add('di-bar')
    this.innerHTML = innerHTML
    this._barLabel = this.querySelector('.bar-label')
    this._barBackground = this.querySelector('.bar-background')
    this._barForeground = this.querySelector('.bar-foreground')
    this.setValue(0)
  }

  get animSpeed(){
    return ANIM_SPEED
  }

  get value(){
    return this._val
  }

  setOptions(options){
    this._options = mergeOptionsObjects(this._options, options)
    this._update()
    return this
  }

  setBadge(html){
    const badge = this.querySelector('.bar-badge')
    if(html){
      badge.classList.remove('displaynone')
      badge.innerHTML = html
    }else{
      badge.classList.add('displaynone')
    }
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

    if(document.hidden){
      options.animate = false
      options.flyingText = false
    }

    val = Math.min(this._options.max, Math.max(this._options.min, Math.round(val)))

    if(options.flyingText){
      this._flyingText(val - this._val)
    }

    if(!options.animate){
      this._val = val
      this._updateLabel()
      this._barBackground.classList.add('hidden')
      this._barBackground.style.width = `${this._pct(val) * 100}%`
      this._barForeground.style.width = `${this._pct(val) * 100}%`
      this._barForeground.style.backgroundColor = this._options.color
    }else {
      await this._animateToValue(val)
    }
  }

  _animateToValue(val){

    function setWidth(bar, pct){
      bar.style.width = `${pct * 100}%`
    }

    return new Promise(res => {

      if(this.animation){
        this.animation.cancel()
        this.animation = null
      }

      const growing = val > this._val
      const secondaryColor = growing ? this._options.increaserColor : this._options.decreaserColor

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
          res(true)
        },
        tick: pct => {
          currentWidth = startWidth * (1 - pct) + targetWidth * pct
          setWidth(animatingBar, currentWidth)
          this._updateLabel(Math.round(this._pctToVal(currentWidth)))
        }
      })
    })
  }

  _pct(val){
    const pct = (val - this._options.min) / (this._options.max - this._options.min)
    return Math.min(1, Math.max(0, pct))
  }

  _pctToVal(pct){
    pct = Math.min(1, Math.max(0, pct))
    return this._options.min * (1 - pct) + this._options.max * pct
  }

  _valToColor(val){
    if(typeof(this._options.color) === 'function'){
      return this._options.color(this._pct(val))
    }
    return this._options.color
  }

  _flyingText(text, options = {}){
    new FlyingTextEffect(this, text, options)
  }

  _update(){
    this._barLabel.classList.toggle('hidden', !this._options.showLabel)
    this._updateLabel()
  }

  _updateLabel(valOverride){
    const val = valOverride ?? this._val
    let html = ''
    if(this._options.showValue){
      html += spwrap(val)
      if(this._options.showMax){
        html += spwrap('/')
        html += spwrap(this._options.max)
      }
    }
    if(this._options.showLabel){
      html += spwrap(this._options.label)
    }
    this._barLabel.innerHTML = html
  }
}

function spwrap(val){
  return `<span>${val}</span>`
}

customElements.define('di-bar', Bar)