export function fadeOut(el, speed = 250){
  return new Promise(res => {
    if(document.hidden){
      el.style.opacity = 0
      return res()
    }
    el.animate([
      { opacity: 0 }
    ], {
      duration: speed,
      easing: 'ease-out'
    }).onfinish = () => {
      el.style.opacity = 0
      res()
    }
  })
}

export function fadeIn(el){
  return new Promise(res => {
    if(document.hidden){
      el.style.opacity = 1
      return res()
    }
    el.animate([
      { opacity: 1 }
    ], {
      duration: 250,
      easing: 'ease-out'
    }).onfinish = () => {
      el.style.opacity = 1
      res()
    }
  })
}

export function flash(el, color, duration = 250){
  const originalBackgroundColor = el.style.backgroundColor || 'transparent'
  return new Promise(res => {
    el.animate([
      { backgroundColor: color },
      { backgroundColor: originalBackgroundColor }
    ], {
      duration,
      easing: 'ease-out'
    }).onfinish = () => {
      res()
    }
  })
}