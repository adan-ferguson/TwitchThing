export function fadeOut(el, speed = 200){
  return new Promise(res => {
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
    el.animate([
      { opacity: 1 }
    ], {
      duration: 200,
      easing: 'ease-out'
    }).onfinish = () => {
      el.style.opacity = 1
      res()
    }
  })
}