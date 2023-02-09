import { makeEl } from '../../../game/utilFunctions.js'

export function fadeOut(el, duration = 350){
  return new Promise(res => {
    if(document.hidden){
      el.style.opacity = 0
      return res()
    }
    const anim = el.animate([
      { opacity: 0 }
    ], {
      duration,
      easing: 'ease-out'
    })
    anim.onfinish = () => {
      res()
      el.style.opacity = 0
    }
  })
}

export function fadeIn(el, duration = 300){
  return new Promise(res => {
    if(document.hidden){
      el.style.opacity = 1
      return res()
    }
    const anim = el.animate([
      { opacity: 1 }
    ], {
      duration,
      easing: 'ease-out'
    })
    anim.onfinish = () => {
      res()
      el.style.opacity = 1
    }
  })
}

export function flash(el, color = '#bbffcf', duration = 250){

  const computed = getComputedStyle(el)
  if(computed.position === 'static'){
    el.style.position = 'relative'
  }

  const flashEl = makeEl({
    class: 'flash-rectangle'
  })
  flashEl.style.backgroundColor = color
  flashEl.style.width = computed.width
  flashEl.style.height = computed.height
  el.appendChild(flashEl)
  fadeOut(flashEl).then(() => {
    flashEl.remove()
  })
}

export function slide(el, fromPoint , toPoint){
  return new Promise(res => {
    if(document.hidden){
      return res()
    }
    el.animate([
      { transform: `translate(${fromPoint.left}px, ${fromPoint.top}px)` },
      { transform: `translate(${toPoint.left}px, ${toPoint.top}px)` }
    ], {
      duration: 300,
      easing: 'linear'
    }).onfinish = () => {
      res()
    }
  })
}