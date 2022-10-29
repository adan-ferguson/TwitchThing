import CustomAnimation from '../../animations/customAnimation.js'
import FlyingTextEffect from '../visualEffects/flyingTextEffect.js'
import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'
import _ from 'lodash'

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
    lineBreakLabel: false,
    color: '#DDD',
    borderColor: null,
    showLabel: true,
    showValue: true,
    showMax: true,
    increaserColor: null,
    decreaserColor: null,
    min: 0,
    max: 100,
    rounding: false
  }

  _barLabel
  backgroundEl
  foregroundEl

  _val = 0

  constructor(){
    super()
    this.classList.add('di-bar')
    this.innerHTML = innerHTML
    this._barLabel = this.querySelector('.bar-label')
    this.backgroundEl = this.querySelector('.bar-background')
    this.foregroundEl = this.querySelector('.bar-foreground')
    this._barBorder = this.querySelector('.bar-border')
    this.setValue(0)
  }

  get animating(){
    return this.animation ? true : false
  }

  get animSpeed(){
    return ANIM_SPEED
  }

  get value(){
    return this._val
  }

  setOptions(options){

    const newOptions = mergeOptionsObjects(this._options, options)
    if(_.isEqual(newOptions, this._options)){
      return this
    }

    this._options = newOptions
    this._barLabel.classList.toggle('hidden', !this._options.showLabel)
    this._updateLabel()
    this._updateColors()
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
      if(options.animate && this.animation.targetVal === val){
        return
      }
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

    val = this._options.rounding ? Math.round(val) : val
    val = Math.min(this._options.max, Math.max(this._options.min, val))

    if(options.flyingText){
      this._flyingText(val - this._val)
    }

    if(!options.animate){
      this._val = val
      this._updateLabel()
      this.backgroundEl.classList.add('hidden')
      this.backgroundEl.style.width = `${this._pct(val) * 100}%`
      this.foregroundEl.style.width = `${this._pct(val) * 100}%`
      this._updateColors()
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
        animatingBar = growing ? this.foregroundEl : this.backgroundEl
        snappingBar = !growing ? this.foregroundEl : this.backgroundEl
        this.backgroundEl.classList.remove('hidden')
        this.backgroundEl.style.backgroundColor = secondaryColor
      }else{
        animatingBar = this.foregroundEl
        snappingBar = null
        this.backgroundEl.classList.add('hidden')
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
          this._updateLabel(this._pctToVal(currentWidth))
        }
      })

      this.animation.targetVal = val
    })
  }

  _pct(val){
    if(this._options.max - this._options.min <= 0){
      return 1
    }
    const pct = (val - this._options.min) / (this._options.max - this._options.min)
    return Math.min(1, Math.max(0, pct))
  }

  _pctToVal(pct){
    pct = Math.min(1, Math.max(0, pct))
    const val = this._options.min * (1 - pct) + this._options.max * pct
    return this._options.rounding ? Math.round(val) : val
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

  _updateColors(){
    this._barBorder.style.borderColor = this._options.borderColor ?? this._options.color
    this.foregroundEl.style.backgroundColor = this._options.color
  }

  _updateLabel(valOverride){
    const val = valOverride ?? this._val
    let html = ''
    if(this._options.showValue){
      let valHtml = spwrap(val)
      if(this._options.showMax){
        valHtml += spwrap('/')
        valHtml += spwrap(this._options.max)
      }
      html += spwrap(valHtml)
    }
    if(this._options.showLabel){
      html += spwrap(this._options.label)
    }
    this._barLabel.innerHTML = html
    this._barLabel.classList.toggle('linebreak', this._options.lineBreakLabel)
  }
}

function spwrap(val){
  return `<span>${val}</span>`
}

customElements.define('di-bar', Bar)