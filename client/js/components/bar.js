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

  setValue(val, cancelAnimationInProgress = true){

    if(cancelAnimationInProgress && this.animation){
      this.animation.cancel()
    }

    this._val = val || 0
    this.setAttribute('title', `${this._val}/${this.max}`)

    let pct = (val - this.min) / (this.max - this.min)
    pct = Math.min(1, Math.max(0, pct))

    this.querySelector('.bar-fill').style.width = `${pct * 100}%`
  }

  setFill(val){
    this.barFill.style.backgroundColor = val
  }

  animateValueChange(diff){

    if(this.animation){
      this.animation.cancel()
    }

    const before = this._val

    return new Promise(res => {
      this.animation = new Animation({
        tick: pct => {
          this.setValue(before + pct * diff, false)
        },
        time: TIME_TO_FILL_ONE_BAR,
        finish: res
      })
    })
  }
}

customElements.define('di-bar', Bar)