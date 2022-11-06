import { EventEmitter } from 'events'

const EFFECT_HTML = (text, color) => `
<span style='color:${color};'>${text}</span>
`

export default class FlyingTextEffect extends EventEmitter{

  constructor(source, text, options = {}){
    super()

    if(!isNaN(text) && !options.color){
      // Integer mode, positive is green and has a leading plus sign
      const number = parseInt(text)
      options.color = number > 0 ? '#75e075' : 'red'
      text = (number > 0 ? '+' : '') + number
    }

    this.source = source
    this.options = {
      origin: source.getBoundingClientRect ? source.getBoundingClientRect() : source,
      text,
      direction: 'up',
      color: 'black',
      distance: 80,
      fontSize: 1.2,
      duration: 2000,
      autoStart: true,
      clearExistingForSource: false,
      ...options
    }

    if(options.clearExistingForSource && this.source.__flyingTextAnim){
      this.source.__flyingTextAnim.remove()
    }

    this.el = document.createElement('div')
    this.el.classList.add('flying-text-effect')
    this.el.innerHTML = EFFECT_HTML(this.options.text, this.options.color)

    const startingPosition = getStartingPosition(this.options.origin, this.options.direction)
    this.el.style.transition = `all ${this.options.duration/500}s ease-out, opacity 1s ease-out`
    this.el.style.left = startingPosition.x + 'px'
    this.el.style.top = startingPosition.y + 'px'
    this.el.style.fontSize = this.options.fontSize + 'em'

    document.querySelector('body').appendChild(this.el)

    if(this.options.autoStart){
      this.start()
    }
  }

  start(){
    this.source.__flyingTextAnim = this.el
    setTimeout(() => {
      const currentTransform = getComputedStyle(this.el).transform
      const distance = this.options.distance * (this.options.direction === 'down' ? 1 : -1)
      const translateStr = ` translateY(${distance}rem)`
      this.el.style.transform = currentTransform + translateStr
      setTimeout(() => {
        this.el.style.opacity = '0'
        setTimeout(() => {
          delete this.source.__flyingTextAnim
          this.el.remove()
          this.emit('finish')
        }, 500)
      }, this.options.duration)
    })
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