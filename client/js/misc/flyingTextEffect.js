const DEFAULTS = {
  direction: 'up',
  color: 'black',
  distance: 25,
  duration: 3000
}

const EFFECT_HTML = (text, color) => `
<span style='color:${color};'>${text}</span>
`

export default class FlyingTextEffect {

  constructor(origin, text, options = {}){

    origin = origin.getBoundingClientRect ? origin.getBoundingClientRect() : origin

    if(!isNaN(text) && !options.color){
      // Integer mode, positive is green and has a leading plus sign
      const number = parseInt(text)
      options.color = number > 0 ? 'green' : 'red'
      text = (number > 0 ? '+' : '') + number
    }

    this.options = Object.assign({ origin, text }, DEFAULTS, options)
    this.el = document.createElement('div')
    this.el.classList.add('flying-text-effect')
    this.el.innerHTML = EFFECT_HTML(this.options.text, this.options.color)

    const startingPosition = getStartingPosition(this.options.origin, this.options.direction)
    this.el.style.transition = `all ${this.options.duration/1000}s ease-out`
    this.el.style.left = startingPosition.x + 'px'
    this.el.style.top = startingPosition.y + 'px'

    document.querySelector('#effects').appendChild(this.el)

    requestAnimationFrame(() => {
      this._start()
      setTimeout(() => {
        this.el.remove()
      }, this.options.duration)
    })
  }

  _start(){
    const currentTransform = getComputedStyle(this.el).transform
    const distance = this.options.distance * (this.options.direction === 'down' ? 1 : -1)
    const translateStr = ` translateY(${distance}rem)`
    this.el.style.transform = currentTransform + translateStr
    this.el.style.opacity = '0'
  }
}

function getStartingPosition(origin, direction){
  if(direction === 'down'){
    return  {
      x: origin.x + origin.width / 2,
      y: origin.y + origin.height
    }
  }else{
    return  {
      x: origin.x + origin.width / 2,
      y: origin.y
    }
  }
}

window.FlyingTextEffect = FlyingTextEffect

export { FlyingTextEffect }